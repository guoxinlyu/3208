# ===== Clone & branch =====
Acknowledgment of AI Assistance

This project used ChatGPT (GPT-5 Thinking) for technical assistance during development and deployment, specifically for:
Debugging GKE + Cloud SQL Proxy connectivity and tuning environment variables/Secrets
Fixing GCE Ingress health checks (adding routes and BackendConfig adjustments)
Standardizing Kubernetes manifests for consistent, repeatable deployments
Writing troubleshooting scripts and quick verification commands
Structuring this README and documenting reproducible steps

All critical code and configuration were implemented, tested, and committed by the author. The AI’s role was to accelerate troubleshooting, organize workflows, and help draft documentation.


# ===== Clone & branch =====
git clone https://github.com/guoxinlyu/3208.git
cd 3208
git checkout type1-clean

# ===== Vars (edit these) =====
export PROJECT_ID=<your-project-id>
export NS=autoshow
export BUCKET=<your-bucket-name>          # e.g. infs3208-post-images-xxxx
export REPO=us-east1-docker.pkg.dev/$PROJECT_ID/apps
export WEB_IMG=$REPO/web
export API_IMG=$REPO/api
export WEB_TAG=v1
export API_TAG=v1

# (If your api-deploy uses cloud-sql-proxy with INSTANCE_CONN)
export INSTANCE_CONN="<project>:us-east1:<instance>"

# ===== Create namespace =====
kubectl get ns $NS >/dev/null 2>&1 || kubectl create ns $NS

# ===== Secrets (JWT + DB creds) =====
kubectl -n $NS create secret generic api-secrets \
  --from-literal=JWT_SECRET='replace-with-a-long-random-secret' \
  --dry-run=client -o yaml | kubectl apply -f -

kubectl -n $NS create secret generic api-db \
  --from-literal=PGDATABASE=postgres \
  --from-literal=PGUSER=postgres \
  --from-literal=PGPASSWORD='<your-db-password>' \
  --dry-run=client -o yaml | kubectl apply -f -

# (If cloud-sql-proxy reads INSTANCE_CONN from a secret)
kubectl -n $NS create secret generic db-credentials \
  --from-literal=INSTANCE_CONN="$INSTANCE_CONN" \
  --dry-run=client -o yaml | kubectl apply -f -

# ===== Build & push images =====
cd app && docker build -t $WEB_IMG:$WEB_TAG . && docker push $WEB_IMG:$WEB_TAG
cd api && docker build -t $API_IMG:$API_TAG . && docker push $API_IMG:$API_TAG
cd ../..

# ===== Apply Kubernetes manifests (in app/k8s/) =====
kubectl apply -f app/k8s/ -n $NS

# ===== Inject runtime env for API =====
kubectl -n $NS set env deploy/api --containers=api \
  PGHOST=127.0.0.1 PGPORT=5432 PORT=3000 BUCKET_NAME=$BUCKET --overwrite=true
kubectl -n $NS set env deploy/api --containers=api --from=secret/api-db
kubectl -n $NS set env deploy/api --containers=api --from=secret/api-secrets

# ===== Verify rollout =====
kubectl -n $NS rollout status deploy/web --timeout=180s
kubectl -n $NS rollout status deploy/api --timeout=180s

# ===== Get Ingress address & test =====
IP=$(kubectl -n $NS get ingress -o jsonpath='{.items[0].status.loadBalancer.ingress[0].ip}')
HN=$(kubectl -n $NS get ingress -o jsonpath='{.items[0].status.loadBalancer.ingress[0].hostname}')
BASE=${IP:+http://$IP}; BASE=${BASE:-http://$HN}
echo "Open: $BASE"

curl -si "$BASE/api/healthz"         # expect 200
curl -s  "$BASE/api/posts" || true   # expect JSON list (jq )


# Optional: bind KSA -> GSA (if the cluster uses Workload Identity)
export KSA=api-k8s-sa
export GSA_EMAIL=autoshow-api-gsa@$PROJECT_ID.iam.gserviceaccount.com

gcloud iam service-accounts add-iam-policy-binding "$GSA_EMAIL" \
  --role roles/iam.workloadIdentityUser \
  --member "serviceAccount:${PROJECT_ID}.svc.id.goog[$NS/$KSA]"

kubectl -n "$NS" annotate sa "$KSA" \
  iam.gke.io/gcp-service-account="$GSA_EMAIL" --overwrite

# Minimum permissions (Cloud SQL + optional GCS)
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$GSA_EMAIL" \
  --role=roles/cloudsql.client

# If the app uploads images to GCS:
gcloud storage buckets add-iam-policy-binding "gs://$BUCKET" \
  --member="serviceAccount:$GSA_EMAIL" \
  --role=roles/storage.objectCreator

