import { Link } from 'react-router-dom'
import { isAuthed } from '../lib/auth.js'

export default function Home() {
    const authed = isAuthed()

    return (
        <div>
            {/* 英雄区：标题 + 文案 + 按钮 */}
            <section className="hero">
                <h1>改装 · 测评 · 车聚，一站到位</h1>
                <p className="muted">发布你的改装方案与赛道测评，按车型与标签检索，结识同好，一起上路。</p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
                    <Link to="/posts" className="btn-primary">浏览热门帖子</Link>
                    {!authed && <Link to="/register" className="btn">加入社区</Link>}
                </div>
            </section>

            {/* 示例内容区：三张“车帖卡片”（真实数据来时用 map 渲染） */}
            <div className="container" style={{ display: 'grid', gap: 16 }}>
                <article className="post">
                    <img className="thumb" src="https://picsum.photos/seed/car1/400/260" alt="thumb" />
                    <div>
                        <h3 className="title">GR Yaris 赛道取向改装清单</h3>
                        <div className="badges">
                            <span className="badge">Toyota</span>
                            <span className="badge">AWD</span>
                            <span className="badge red">Track</span>
                        </div>
                    </div>
                </article>

                <article className="post">
                    <img className="thumb" src="https://picsum.photos/seed/car2/400/260" alt="thumb" />
                    <div>
                        <h3 className="title">Model 3 高速能量回收调优</h3>
                        <div className="badges">
                            <span className="badge">Tesla</span>
                            <span className="badge">EV</span>
                            <span className="badge">DIY</span>
                        </div>
                    </div>
                </article>

                <article className="post">
                    <img className="thumb" src="https://picsum.photos/seed/car3/400/260" alt="thumb" />
                    <div>
                        <h3 className="title">Civic FK7 低成本操控升级</h3>
                        <div className="badges">
                            <span className="badge">Honda</span>
                            <span className="badge">FWD</span>
                            <span className="badge">Budget</span>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
