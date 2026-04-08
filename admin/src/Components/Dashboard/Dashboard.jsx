import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { backend_url, currency } from '../../App';

const sk = (w='100%', h=16, mb=0) => ({
  width:w, height:h, borderRadius:2, marginBottom:mb,
  background:'linear-gradient(90deg,var(--surface-2) 25%,var(--surface-3) 50%,var(--surface-2) 75%)',
  backgroundSize:'400px 100%', animation:'shimmer 1.4s infinite',
});

const StatCard = ({ title, value, sub, icon, color, loading }) => (
  <div style={{
    background:'var(--surface)', border:'1px solid var(--border)',
    borderRadius:'var(--radius-md)', padding:'22px 22px 18px',
    position:'relative', overflow:'hidden', animation:'fadeUp .35s ease forwards',
    transition:'var(--tr)',
  }}
  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--border-hi)'}
  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
    <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:color}} />
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
      <div style={{flex:1}}>
        <p style={{fontSize:10,letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--text-muted)',marginBottom:10}}>{title}</p>
        {loading ? <div style={sk('60%',28,6)}/> : <h3 style={{fontSize:'1.6rem',fontWeight:500,color:'var(--text)',letterSpacing:'-0.01em'}}>{value}</h3>}
        {loading ? <div style={sk('80%',12)}/> : <p style={{fontSize:11,color:'var(--text-muted)',marginTop:6}}>{sub}</p>}
      </div>
      <div style={{
        width:40,height:40,borderRadius:'var(--radius)',
        background:`rgba(${color==='#c9a96e'?'201,169,110':'76,175,125'}, 0.12)`,
        display:'flex',alignItems:'center',justifyContent:'center',
        fontSize:18,flexShrink:0,
      }}>{icon}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({ totalProducts:0, totalValue:0, totalDiscount:0, averagePrice:0, averageDiscount:0, highestPrice:0, lowestPrice:0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryData, setCategoryData] = useState({ women:0, men:0, kids:0 });
  const [priceRanges, setPriceRanges] = useState({ low:0, medium:0, high:0, premium:0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async (silent=false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch(`${backend_url}/allproducts`);
      const data = await res.json();
      const products = data.products || data;
      if (Array.isArray(products) && products.length > 0) {
        const totalProducts = products.length;
        const totalValue = products.reduce((s,p) => s+(p.new_price||0), 0);
        const totalOldValue = products.reduce((s,p) => s+(p.old_price||0), 0);
        const totalDiscount = totalOldValue - totalValue;
        const averagePrice = Math.round(totalValue/totalProducts);
        const discounts = products.map(p => p.old_price>p.new_price ? ((p.old_price-p.new_price)/p.old_price)*100 : 0);
        const averageDiscount = Math.round(discounts.reduce((s,d)=>s+d,0)/totalProducts);
        const prices = products.map(p=>p.new_price);
        const highestPrice = Math.max(...prices);
        const lowestPrice = Math.min(...prices);
        const women = products.filter(p=>p.category?.toLowerCase()==='women').length;
        const men   = products.filter(p=>p.category?.toLowerCase()==='men').length;
        const kids  = products.filter(p=>p.category?.toLowerCase()==='kids'||p.category?.toLowerCase()==='kid').length;
        const low     = products.filter(p=>p.new_price<1000).length;
        const medium  = products.filter(p=>p.new_price>=1000&&p.new_price<2000).length;
        const high    = products.filter(p=>p.new_price>=2000&&p.new_price<3000).length;
        const premium = products.filter(p=>p.new_price>=3000).length;
        const topDiscount = [...products].filter(p=>p.old_price>p.new_price)
          .sort((a,b)=>((b.old_price-b.new_price)/b.old_price)-((a.old_price-a.new_price)/a.old_price)).slice(0,5);
        setStats({ totalProducts, totalValue, totalDiscount, averagePrice, averageDiscount, highestPrice, lowestPrice });
        setRecentProducts(products.slice(-6).reverse());
        setTopProducts(topDiscount);
        setCategoryData({ women, men, kids });
        setPriceRanges({ low, medium, high, premium });
        setLastUpdated(new Date());
      }
      setLoading(false);
    } catch(e) { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [location]);
  useEffect(() => { const id = setInterval(()=>fetchData(true),30000); return ()=>clearInterval(id); }, []);

  const total = stats.totalProducts || 1;
  const catPct = (n) => ((n/total)*100).toFixed(1);

  return (
    <div style={{ padding:'28px 32px', minHeight:'100vh', background:'var(--bg)' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:28 }}>
        <div>
          <p style={{ fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--accent)', marginBottom:6 }}>Overview</p>
          <h1 style={{ fontFamily:'var(--font-d)', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:300, color:'var(--text)', lineHeight:1.1 }}>
            Live Dashboard
          </h1>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:6 }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--success)', display:'inline-block', animation:'pulse 2s ease infinite' }} />
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>fetchData()} style={{ padding:'8px 16px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', color:'var(--text-muted)', fontSize:12, transition:'var(--tr)' }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='var(--border-hi)'; e.currentTarget.style.color='var(--text)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
            ↺ Refresh
          </button>
          <Link to="/addproduct" style={{ padding:'8px 20px', background:'var(--accent)', color:'#0a0a0a', borderRadius:'var(--radius)', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600, display:'inline-flex', alignItems:'center', transition:'var(--tr)' }}>
            + Add Product
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {[
          { title:'Total Products', value: stats.totalProducts, sub:'Active inventory', icon:'◫', color:'#c9a96e' },
          { title:'Inventory Value', value: `${currency}${stats.totalValue.toLocaleString()}`, sub:'Total catalogue worth', icon:'◈', color:'#4caf7d' },
          { title:'Avg. Price', value: `${currency}${stats.averagePrice.toLocaleString()}`, sub:`${stats.averageDiscount}% avg discount`, icon:'◉', color:'#5a9cf5' },
          { title:'Customer Savings', value: `${currency}${stats.totalDiscount.toLocaleString()}`, sub:'Total discount given', icon:'◎', color:'#e0a84a' },
        ].map((s,i) => <StatCard key={i} {...s} loading={loading} />)}
      </div>

      {/* Middle row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:24 }}>

        {/* Category Distribution */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
            <h2 style={{ fontFamily:'var(--font-d)', fontSize:'1.2rem', fontWeight:400, color:'var(--text)' }}>Category Distribution</h2>
            <span style={{ fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--text-muted)' }}>Live</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {[
              { name:'Women', count:categoryData.women, color:'#e8a0b4', barColor:'rgba(232,160,180,0.7)' },
              { name:'Men',   count:categoryData.men,   color:'#5a9cf5', barColor:'rgba(90,156,245,0.7)' },
              { name:'Kids',  count:categoryData.kids,  color:'#e0a84a', barColor:'rgba(224,168,74,0.7)' },
            ].map((cat,i) => {
              const pct = loading ? 0 : catPct(cat.count);
              return (
                <div key={i}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:13, color:'var(--text)' }}>{cat.name}</span>
                    <span style={{ fontSize:12, color:'var(--text-muted)' }}>{loading ? '—' : `${cat.count} items · ${pct}%`}</span>
                  </div>
                  <div style={{ height:6, background:'var(--surface-3)', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:cat.barColor, borderRadius:3, transition:'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Ranges */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:24 }}>
          <h2 style={{ fontFamily:'var(--font-d)', fontSize:'1.2rem', fontWeight:400, color:'var(--text)', marginBottom:18 }}>Price Ranges</h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { label:'Budget',  range:'< ₹1K',    count:priceRanges.low,     color:'var(--success)' },
              { label:'Mid',     range:'₹1K–2K',   count:priceRanges.medium,  color:'var(--info)' },
              { label:'High',    range:'₹2K–3K',   count:priceRanges.high,    color:'var(--accent)' },
              { label:'Premium', range:'> ₹3K',    count:priceRanges.premium, color:'var(--warning)' },
            ].map((r,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'var(--surface-2)', borderRadius:'var(--radius)', border:'1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:500, color:r.color }}>{r.label}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)' }}>{r.range}</p>
                </div>
                <span style={{ fontSize:'1.1rem', fontWeight:500, color:'var(--text)' }}>{loading ? '—' : r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:16 }}>

        {/* Best Deals */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
            <h2 style={{ fontFamily:'var(--font-d)', fontSize:'1.2rem', fontWeight:400, color:'var(--text)' }}>Best Deals</h2>
            <span style={{ fontSize:10, color:'var(--success)', letterSpacing:'0.12em', textTransform:'uppercase' }}>● Live</span>
          </div>
          {!loading && topProducts.length > 0 ? topProducts.map((p,i) => {
            const disc = Math.round(((p.old_price-p.new_price)/p.old_price)*100);
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontSize:11, color:'var(--text-muted)', width:16, textAlign:'right' }}>#{i+1}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</p>
                  <p style={{ fontSize:11, color:'var(--success)' }}>{disc}% off</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontSize:12, color:'var(--accent)' }}>{currency}{p.new_price}</p>
                  <p style={{ fontSize:11, color:'var(--text-muted)', textDecoration:'line-through' }}>{currency}{p.old_price}</p>
                </div>
              </div>
            );
          }) : (
            <p style={{ fontSize:13, color:'var(--text-muted)', textAlign:'center', padding:'20px 0' }}>No discounted products yet</p>
          )}
        </div>

        {/* Recent Products */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <h2 style={{ fontFamily:'var(--font-d)', fontSize:'1.2rem', fontWeight:400, color:'var(--text)' }}>Latest Products</h2>
            <Link to="/listproduct" style={{ fontSize:11, color:'var(--accent)', letterSpacing:'0.1em', textTransform:'uppercase' }}>View All →</Link>
          </div>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {[...Array(6)].map((_,i)=><div key={i} style={sk('100%',120)} />)}
            </div>
          ) : recentProducts.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
              {recentProducts.map((p,i)=>{
                const disc = p.old_price>p.new_price ? Math.round(((p.old_price-p.new_price)/p.old_price)*100) : 0;
                const src = p.image?.startsWith('http') ? p.image : backend_url+p.image;
                return (
                  <div key={i} style={{ cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.querySelector('img').style.transform='scale(1.06)'}
                    onMouseLeave={e=>e.currentTarget.querySelector('img').style.transform='scale(1)'}>
                    <div style={{ position:'relative', overflow:'hidden', borderRadius:'var(--radius)', background:'var(--surface-2)', aspectRatio:'1', marginBottom:8 }}>
                      <img src={src} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .5s ease' }} onError={e=>e.target.style.display='none'} />
                      {disc>0 && <span style={{ position:'absolute', top:6, right:6, background:'var(--success)', color:'#0a0a0a', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:2 }}>{disc}%</span>}
                    </div>
                    <p style={{ fontSize:12, color:'var(--text)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:3 }}>{p.name}</p>
                    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                      <span style={{ fontSize:12, color:'var(--accent)', fontWeight:500 }}>{currency}{p.new_price}</span>
                      {disc>0 && <span style={{ fontSize:11, color:'var(--text-muted)', textDecoration:'line-through' }}>{currency}{p.old_price}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'30px 0' }}>
              <p style={{ color:'var(--text-muted)', fontSize:13, marginBottom:12 }}>No products yet</p>
              <Link to="/addproduct" style={{ fontSize:12, color:'var(--accent)' }}>Add your first product →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Pricing stats footer bar */}
      <div style={{ marginTop:16, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'18px 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, borderTop:'2px solid var(--accent-dk)' }}>
        {[
          { label:'Highest Price', value:`${currency}${stats.highestPrice.toLocaleString()}` },
          { label:'Lowest Price',  value:`${currency}${stats.lowestPrice.toLocaleString()}` },
          { label:'Avg. Price',    value:`${currency}${stats.averagePrice.toLocaleString()}` },
          { label:'Avg. Discount', value:`${stats.averageDiscount}%` },
        ].map((s,i)=>(
          <div key={i} style={{ textAlign:'center' }}>
            <p style={{ fontSize:10, letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:6 }}>{s.label}</p>
            {loading ? <div style={sk('60%',22)} /> : <p style={{ fontSize:'1.3rem', fontWeight:500, color:'var(--text)' }}>{s.value}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
