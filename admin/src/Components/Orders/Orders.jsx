import React, { useState, useEffect } from 'react';
import { backend_url, currency } from '../../App';
import { useToast } from '../../Context/ToastContext';
import parcel_icon from '../../Components/Assets/Product_Cart.svg';

const statusColors = {
  'Order Placed': { bg:'rgba(90,156,245,0.1)', color:'var(--info)', border:'rgba(90,156,245,0.2)' },
  'Processing':   { bg:'rgba(224,168,74,0.1)', color:'var(--warning)', border:'rgba(224,168,74,0.2)' },
  'Shipped':      { bg:'rgba(201,169,110,0.1)', color:'var(--accent)', border:'rgba(201,169,110,0.2)' },
  'Out for delivery': { bg:'rgba(201,169,110,0.12)', color:'var(--accent-lt)', border:'rgba(201,169,110,0.25)' },
  'Delivered':    { bg:'rgba(76,175,125,0.1)', color:'var(--success)', border:'rgba(76,175,125,0.2)' },
};

const Orders = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(backend_url + '/api/order/list', {
        method: 'POST',
        headers: { 'Accept':'application/json', 'Content-Type':'application/json' },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
      else error("Error fetching orders");
      setLoading(false);
    } catch (e) { error("Error fetching orders"); setLoading(false); }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const res = await fetch(backend_url + '/api/order/status', {
        method: 'POST',
        headers: { 'Accept':'application/json', 'Content-Type':'application/json' },
        body: JSON.stringify({ orderId, status: event.target.value })
      });
      const data = await res.json();
      if (data.success) { await fetchAllOrders(); success("Status updated"); }
    } catch (e) { error("Error updating status"); }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const th = { fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--text-muted)', fontWeight:400, padding:'12px 16px', textAlign:'left', borderBottom:'1px solid var(--border-hi)', whiteSpace:'nowrap' };
  const td = { padding:'14px 16px', verticalAlign:'top', borderBottom:'1px solid var(--border)', fontSize:13, color:'var(--text)' };

  return (
    <div style={{ padding:'28px 32px', animation:'fadeUp .35s ease forwards' }}>
      <div style={{ marginBottom:22 }}>
        <p style={{ fontSize:11, letterSpacing:'0.22em', textTransform:'uppercase', color:'var(--accent)', marginBottom:6 }}>Management</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <h1 style={{ fontFamily:'var(--font-d)', fontSize:'clamp(1.4rem,2.5vw,2rem)', fontWeight:300, color:'var(--text)' }}>Orders</h1>
          <span style={{ fontSize:12, color:'var(--text-muted)' }}>{orders.length} orders total</span>
        </div>
      </div>

      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'60px', textAlign:'center' }}>
            <div style={{ width:24, height:24, border:'2px solid var(--border-hi)', borderTop:'2px solid var(--accent)', borderRadius:'50%', animation:'spin .7s linear infinite', margin:'0 auto 12px' }} />
            <p style={{ fontSize:13, color:'var(--text-muted)' }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding:'60px', textAlign:'center' }}>
            <p style={{ fontSize:14, color:'var(--text-muted)' }}>No orders yet.</p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'var(--surface-2)' }}>
                  <th style={th}>Product</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Date</th>
                  <th style={th}>Amount</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => {
                  const sc = statusColors[order.status] || statusColors['Order Placed'];
                  return (
                    <tr key={idx}
                      onMouseEnter={e => [...e.currentTarget.cells].forEach(c => c.style.background='var(--surface-2)')}
                      onMouseLeave={e => [...e.currentTarget.cells].forEach(c => c.style.background='transparent')}
                      style={{ transition:'background .2s' }}>
                      <td style={td}>
                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          {order.products.map((item, i) => (
                            <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                              <img
                                src={item.image || parcel_icon}
                                alt=""
                                style={{ width:40, height:48, objectFit:'cover', borderRadius:'var(--radius)', background:'var(--surface-2)', flexShrink:0 }}
                                onError={e => { e.target.src = parcel_icon; }}
                              />
                              <div>
                                <p style={{ fontSize:12, color:'var(--text)', maxWidth:180, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                                  {item.name || 'Product'}
                                </p>
                                <p style={{ fontSize:11, color:'var(--text-muted)' }}>Qty: {item.quantity}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td style={td}>
                        <p style={{ fontWeight:500, marginBottom:3 }}>{order.address?.firstName} {order.address?.lastName}</p>
                        <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>{order.address?.phone}</p>
                        <p style={{ fontSize:11, color:'var(--text-muted)', maxWidth:180 }}>{order.address?.street}, {order.address?.city}</p>
                      </td>
                      <td style={{ ...td, whiteSpace:'nowrap' }}>
                        <p>{new Date(order.date).toLocaleDateString()}</p>
                        <p style={{ fontSize:11, color:'var(--text-muted)' }}>{new Date(order.date).toLocaleTimeString()}</p>
                      </td>
                      <td style={{ ...td, color:'var(--accent)', fontWeight:500 }}>
                        {currency}{order.amount}
                      </td>
                      <td style={td}>
                        <select
                          value={order.status}
                          onChange={(e) => statusHandler(e, order._id)}
                          style={{
                            padding:'6px 10px',
                            background: sc.bg,
                            border:`1px solid ${sc.border}`,
                            color: sc.color,
                            borderRadius:'var(--radius)',
                            fontSize:11,
                            fontWeight:500,
                            outline:'none',
                            cursor:'pointer',
                            fontFamily:'var(--font-b)',
                            letterSpacing:'0.04em',
                          }}
                        >
                          {['Order Placed','Processing','Shipped','Out for delivery','Delivered'].map(s =>
                            <option key={s} value={s} style={{ background:'#1a1a1a', color:'var(--text)' }}>{s}</option>
                          )}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
