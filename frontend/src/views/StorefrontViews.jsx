import { useEffect, useState } from 'react'
import { Menu, X, Search, User, Heart, Bag, Arrow, Sun, Moon, Truck, Shield, Refresh } from '../components/Icons.jsx'

const money = (n) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

export function Brand({ compact = false }) {
  return <button className={`brand ${compact ? 'brand--compact' : ''}`} onClick={() => { location.hash = '#home' }} aria-label="VELORA home"><img className="brand-mark" src="/velora-mark.svg" alt="" aria-hidden="true"/><span>VELORA</span></button>
}

export function Header({ cartCount, favoriteCount, theme, setTheme }) {
  const [menu, setMenu] = useState(false)
  const go = (hash) => { location.hash = hash; setMenu(false) }
  return <>
    <header className="header">
      <div className="header-inner">
        <div className="header-left">
          <button className="icon-button menu-trigger" onClick={() => setMenu(true)} aria-label="Abrir menu"><Menu/></button>
          <div className="search desktop-only"><Search size={18}/><input placeholder="Buscar produtos" onKeyDown={(event) => event.key === 'Enter' && go('#shop')} /></div>
        </div>
        <Brand />
        <nav className="desktop-nav desktop-only">
          <button onClick={() => go('#shop')}>Loja</button>
          <button onClick={() => go('#shop')}>Novidades</button>
          <button className="collections-link" onClick={() => go('#shop')}>Coleções <span aria-hidden="true">⌄</span></button>
          <button onClick={() => go('#profile')} aria-label="Perfil"><User/></button>
          <button className="count-wrap" onClick={() => go('#favorites')} aria-label="Favoritos"><Heart/><em>{favoriteCount}</em></button>
          <button className="count-wrap" onClick={() => go('#cart')} aria-label="Carrinho"><Bag/><em>{cartCount}</em></button>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Alternar tema">{theme === 'dark' ? <Sun/> : <Moon/>}</button>
        </nav>
        <span className="mobile-only header-spacer" />
      </div>
    </header>
    {menu && <div className="drawer-backdrop" onClick={() => setMenu(false)}><aside className="drawer" onClick={(event) => event.stopPropagation()}>
      <div className="drawer-top"><Brand compact/><button className="icon-button" onClick={() => setMenu(false)}><X/></button></div>
      <div className="drawer-search"><Search size={18}/><input placeholder="Buscar na VELORA" /></div>
      <button onClick={() => go('#home')}>Início</button><button onClick={() => go('#shop')}>Loja</button><button onClick={() => go('#favorites')}>Favoritos <span>{favoriteCount}</span></button><button onClick={() => go('#cart')}>Carrinho <span>{cartCount}</span></button><button onClick={() => go('#profile')}>Minha conta</button><button onClick={() => go('#contact')}>Contato</button>
      <div className="drawer-theme"><span>Aparência</span><button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <><Sun/> Modo claro</> : <><Moon/> Modo escuro</>}</button></div>
    </aside></div>}
  </>
}

export function ProductCard({ product, favorite, onFavorite, onOpen }) {
  return <article className="product-card">
    <div className="product-image-wrap">
      {product.badge && <span className="badge">{product.badge}</span>}
      <button className={`favorite ${favorite ? 'is-active' : ''}`} onClick={() => onFavorite(product.id)} aria-label="Favoritar"><Heart/></button>
      <img src={product.image} alt={product.name} onClick={() => onOpen(product.id)} />
    </div>
    <button className="product-info" onClick={() => onOpen(product.id)}><span>{product.category}</span><h3>{product.name}</h3><div><strong>{money(product.price)}</strong>{product.oldPrice && <s>{money(product.oldPrice)}</s>}</div></button>
  </article>
}

export function Home({ products, categories, favorites, onFavorite, onOpen }) {
  const heroProduct = products[0]
  return <>
    <section className="hero section-shell" id="home">
      <div className="hero-copy">
        <span className="eyebrow">COLEÇÃO 01 / 2026</span>
        <h1>VISTA O<br/><i>SEU RITMO.</i></h1>
        <p>Moda urbana, direta e versátil. Peças pensadas para acompanhar cidade, estudo, trabalho e noite.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => { location.hash='#shop' }}>Explorar coleção <Arrow size={18}/></button>
          <button className="btn btn-ghost" onClick={() => { location.hash='#shop' }}>Ver novidades</button>
        </div>
      </div>
      <div className="hero-art">
        <img src={heroProduct.image} alt={heroProduct.name}/>
        <span className="hero-note">DROP 01<br/><strong>URBAN MOTION</strong></span>
      </div>
    </section>

    <section className="section-shell home-highlights block">
      <div className="home-catalog-head">
        <div><span className="eyebrow">CATÁLOGO</span><h2>Destaques</h2></div>
        <div className="home-chips">
          <button className="active" onClick={() => { location.hash='#shop' }}>Todos</button>
          {categories.map((category) => <button key={category.name} onClick={() => { location.hash='#shop' }}>{category.name}</button>)}
        </div>
      </div>
      <div className="product-grid">{products.slice(0,4).map((product) => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onOpen={onOpen}/>)}</div>
    </section>

    <section className="section-shell block">
      <div className="section-heading"><div><span className="eyebrow">ENCONTRE SEU ESTILO</span><h2>Comprar por categoria</h2></div><button onClick={() => { location.hash='#shop' }}>Ver tudo <Arrow size={17}/></button></div>
      <div className="category-grid">{categories.map((category, index) => <button key={category.name} className={`category-card cat-${index}`} onClick={() => { location.hash='#shop' }}><img className="category-photo" src={category.image} alt=""/><span>0{index+1}</span><div className="category-copy"><h3>{category.name}</h3><p>{category.text}</p><Arrow/></div></button>)}</div>
    </section>

    <section className="benefits section-shell"><div><Truck/><strong>Frete simplificado</strong><span>grátis acima de R$ 299</span></div><div><Refresh/><strong>Troca fácil</strong><span>até 7 dias após receber</span></div><div><Shield/><strong>Compra protegida</strong><span>ambiente seguro</span></div></section>
    <section className="newsletter"><div><span className="eyebrow">VELORA / CÍRCULO</span><h2>Entre no radar.</h2><p>Novidades, drops e benefícios — sem spam.</p></div><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="seu@email.com"/><button className="btn btn-primary">Quero receber</button></form></section>
  </>
}

export function Shop({ controller, favorites, onFavorite, onOpen }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const categories = controller.listCategories()
  const visible = controller.filterProducts({ query, category })
  return <main className="section-shell page"><div className="page-title"><span className="eyebrow">CATÁLOGO</span><h1>Loja</h1><p>{visible.length} peças disponíveis pela API.</p></div><div className="shop-toolbar"><div className="shop-search"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto"/></div><div className="chips">{categories.map((item)=><button key={item} className={category===item?'active':''} onClick={()=>setCategory(item)}>{item}</button>)}</div></div><div className="product-grid">{visible.map((product)=><ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onOpen={onOpen}/>)}</div></main>
}

export function ProductPage({ product, favorite, onFavorite, addCart }) {
  const [size, setSize] = useState(product.sizes[0])
  const [color, setColor] = useState(product.colors[0])
  const [added, setAdded] = useState(false)
  const handleAdd = () => { addCart(product.id, { size, color }); setAdded(true); setTimeout(() => setAdded(false), 1800) }
  return <main className="section-shell page product-page"><button className="back" onClick={()=>history.back()}>← voltar</button><div className="product-layout"><div className="product-main-image"><img src={product.image} alt={product.name}/></div><div className="product-details"><span className="eyebrow">{product.category}</span><h1>{product.name}</h1><div className="price-line"><strong>{money(product.price)}</strong>{product.oldPrice && <s>{money(product.oldPrice)}</s>}</div><p>{product.description}</p><hr/><label>Cor <strong style={{color}}>●</strong></label><div className="swatches">{product.colors.map((item)=><button key={item} style={{background:item}} className={color===item?'active':''} onClick={()=>setColor(item)} aria-label={`Cor ${item}`}/>)}</div><label>Tamanho</label><div className="sizes">{product.sizes.map((item)=><button key={item} className={size===item?'active':''} onClick={()=>setSize(item)}>{item}</button>)}</div><div className="product-actions"><button className="btn btn-primary" onClick={handleAdd}>{added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}</button><button className={`btn btn-square ${favorite?'is-active':''}`} onClick={()=>onFavorite(product.id)}><Heart/></button></div><div className="mini-benefits"><span><Truck size={18}/> envio estimado em 2–5 dias</span><span><Refresh size={18}/> troca simplificada</span></div></div></div></main>
}

export function Cart({ sale, removeItem, onOpen, customer, onFinalize, onCalculateShipping, supabaseOnline }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [shippingBusy, setShippingBusy] = useState(false)
  const [cep, setCep] = useState(sale.shippingCep || '')
  const items = sale.items

  const calculate = async () => {
    try {
      setShippingBusy(true)
      setMessage('')
      const result = await onCalculateShipping(cep)
      setMessage(`${result.label} · ${money(result.cost)}`)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setShippingBusy(false)
    }
  }

  const finalize = async () => {
    setMessage('')
    if (!customer) { onFinalize(); return }
    try {
      setBusy(true)
      await onFinalize()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return <main className="section-shell page"><div className="page-title"><span className="eyebrow">SUA SELEÇÃO</span><h1>Carrinho</h1></div>{!items.length?<Empty title="Seu carrinho está vazio" button="Explorar produtos"/>:<div className="cart-layout"><div className="cart-list">{items.map((item,index)=><div className="cart-item" key={`${item.product.id}-${index}`}><img src={item.product.image} alt=""/><button onClick={()=>onOpen(item.product.id)}><span>{item.product.category}</span><strong>{item.product.name}</strong><small>{item.size} · {item.quantity} unidade</small></button><b>{money(item.subtotal)}</b><button className="remove" onClick={()=>removeItem(index)}>Remover</button></div>)}</div><aside className="summary"><span>Resumo da venda</span><div><small>Subtotal</small><strong>{money(sale.subtotal)}</strong></div><div><small>Frete</small><strong>{sale.shippingCost === 0 ? 'Grátis' : money(sale.shippingCost)}</strong></div><div className="shipping-box"><label>CEP<input value={cep} onChange={(event)=>setCep(event.target.value)} placeholder="00000-000" inputMode="numeric"/></label><button type="button" className="btn btn-ghost" onClick={calculate} disabled={shippingBusy}>{shippingBusy ? 'Calculando...' : 'Calcular frete'}</button></div><hr/><div className="summary-total"><small>Total</small><strong>{money(sale.total)}</strong></div><button className="btn btn-primary" disabled={busy} onClick={finalize}>{!customer ? 'Identificar cliente' : busy ? 'Processando...' : 'Finalizar com pagamento simulado'}</button>{message&&<p className="form-message">{message}</p>}<p>{supabaseOnline ? 'A API da VELORA valida o pedido e registra a venda no Supabase. O pagamento é simulado.' : 'API desconectada: execute npm run ecommerce na pasta principal.'}</p></aside></div>}</main>
}

export function Favorites({ products, favorites, onFavorite, onOpen }) {
  const list = products.filter((product)=>favorites.includes(product.id))
  return <main className="section-shell page"><div className="page-title"><span className="eyebrow">SALVOS</span><h1>Favoritos</h1></div>{!list.length?<Empty title="Você ainda não salvou nenhuma peça" button="Ir para loja"/>:<div className="product-grid">{list.map((product)=><ProductCard key={product.id} product={product} favorite onFavorite={onFavorite} onOpen={onOpen}/>)}</div>}</main>
}

export function Profile({ customer, onLogin, onRegister, onRecover, onUpdateProfile, onLogout, onLoadSales, onUploadAvatar, supabaseOnline }) {
  const [register,setRegister]=useState(false)
  const [message,setMessage]=useState('')
  const [busy,setBusy]=useState(false)
  const [avatarBusy,setAvatarBusy]=useState(false)
  const [sales,setSales]=useState([])

  useEffect(() => {
    let active = true
    if (!customer || !supabaseOnline) { setSales([]); return undefined }
    onLoadSales().then((history) => { if (active) setSales(history) }).catch(() => {})
    return () => { active = false }
  }, [customer, supabaseOnline, onLoadSales])

  const changeAvatar = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setAvatarBusy(true)
      setMessage('')
      await onUploadAvatar(file)
      setMessage('Foto de perfil atualizada ✓')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setAvatarBusy(false)
      event.target.value = ''
    }
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    const data = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      setBusy(true)
      setMessage('')
      await onUpdateProfile({
        name: data.name,
        phone: data.phone,
        address: {
          cep: data.cep,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
      })
      setMessage('Perfil atualizado ✓')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  if (customer) return <main className="section-shell page auth-page"><div className="auth-copy"><span className="eyebrow">MINHA VELORA</span><h1>Olá, {customer.name}.</h1><p>Autenticação pelo Supabase Auth; perfil, endereço e pedidos passam pela API REST da VELORA.</p></div><div className="auth-card profile-card">
    <label className="profile-avatar" title="Alterar foto de perfil">
      {customer.avatarUrl ? <img src={customer.avatarUrl} alt={`Foto de ${customer.name}`}/> : <span>{customer.name?.slice(0,1)?.toUpperCase() || 'V'}</span>}
      <input type="file" accept="image/*" onChange={changeAvatar} disabled={avatarBusy}/>
      <small>{avatarBusy ? 'Enviando...' : 'Alterar foto'}</small>
    </label>
    <strong>{customer.name}</strong><span>{customer.email}</span><span className={`api-state ${supabaseOnline ? 'online' : 'offline'}`}>{supabaseOnline ? 'API + Supabase conectados' : 'API desconectada'}</span>
    <form className="profile-data-form" onSubmit={saveProfile}>
      <label>Nome<input name="name" defaultValue={customer.name || ''} required/></label>
      <label>Telefone<input name="phone" defaultValue={customer.phone || ''} placeholder="(12) 99999-9999"/></label>
      <label>CEP<input name="cep" defaultValue={customer.address?.cep || ''} placeholder="00000-000"/></label>
      <label>Rua<input name="street" defaultValue={customer.address?.street || ''}/></label>
      <label>Número<input name="number" defaultValue={customer.address?.number || ''}/></label>
      <label>Complemento<input name="complement" defaultValue={customer.address?.complement || ''}/></label>
      <label>Bairro<input name="neighborhood" defaultValue={customer.address?.neighborhood || ''}/></label>
      <label>Cidade<input name="city" defaultValue={customer.address?.city || ''}/></label>
      <label>UF<input name="state" defaultValue={customer.address?.state || ''} maxLength="2"/></label>
      <button className="btn btn-ghost" disabled={busy}>{busy ? 'Salvando...' : 'Salvar dados'}</button>
    </form>
    {message&&<p className="form-message">{message}</p>}
    <button className="btn btn-primary" onClick={()=>{location.hash='#cart'}}>Voltar ao carrinho</button>
    {sales.length>0&&<div className="orders-mini"><small>Pedidos registrados</small>{sales.slice(0,3).map((sale)=><div key={sale.id}><span>#{sale.id.slice(0,8).toUpperCase()}</span><strong>{money(sale.total)}</strong></div>)}</div>}
    <button className="link-button" onClick={onLogout}>Sair da conta</button>
  </div></main>

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const data = Object.fromEntries(form.entries())
    if (register && data.password !== data.confirmPassword) { setMessage('As senhas precisam ser iguais.'); return }
    try {
      setBusy(true)
      setMessage('')
      if (register) {
        const result = await onRegister(data)
        setMessage(result?.requiresEmailConfirmation
          ? 'Conta criada. Confirme o e-mail para entrar.'
          : 'Cadastro criado com sucesso ✓')
      } else {
        await onLogin(data)
        setMessage('Login realizado ✓')
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  const recover = async (event) => {
    const form = event.currentTarget.closest('form')
    const email = new FormData(form).get('email')
    if (!email) { setMessage('Informe seu e-mail para recuperar a senha.'); return }
    try {
      setBusy(true)
      const result = await onRecover(email)
      setMessage(result.message || 'E-mail de recuperação solicitado.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }

  return <main className="section-shell page auth-page"><div className="auth-copy"><span className="eyebrow">MINHA VELORA</span><h1>{register?'Criar cliente':'Identificar cliente.'}</h1><p>Cadastro e login usam Supabase Auth por meio da API REST da VELORA. A senha não é armazenada pela aplicação.</p></div><form className="auth-card" onSubmit={submit}>{register&&<label>Nome<input name="name" placeholder="Seu nome" required/></label>}<label>E-mail<input name="email" type="email" placeholder="voce@email.com" required/></label><label>Senha<input name="password" type="password" placeholder="••••••••" required minLength="6"/></label>{register&&<label>Confirmar senha<input name="confirmPassword" type="password" placeholder="••••••••" required/></label>}<button className="btn btn-primary" disabled={busy}>{busy ? 'Aguarde...' : register?'Criar cliente':'Entrar'}</button>{message&&<p className="form-message">{message}</p>}{!register&&<button type="button" className="link-button" onClick={recover}>Esqueci minha senha</button>}<button type="button" className="link-button" onClick={()=>{setRegister(!register);setMessage('')}}>{register?'Já tenho cadastro':'Quero criar um cliente'}</button></form></main>
}

export function SaleSuccess({ sale }) {
  return <main className="section-shell page success-page"><div className="success-card"><img className="brand-mark brand-mark--standalone" src="/velora-mark.svg" alt="" aria-hidden="true"/><span className="eyebrow">VENDA REGISTRADA PELA API</span><h1>Pedido demonstrativo concluído.</h1><p>A venda <strong>#{sale.id.slice(0,8).toUpperCase()}</strong> foi validada pela API e persistida no Supabase para <strong>{sale.customer?.name}</strong>.</p><div><span>Total</span><strong>{money(sale.total)}</strong></div><div><span>Status</span><strong>{sale.status}</strong></div><div><span>Pagamento</span><strong>{sale.payment?.status === 'approved' ? 'Simulado · aprovado' : sale.payment?.status}</strong></div><div><span>Referência</span><strong>{sale.payment?.reference}</strong></div><p className="fake-payment-note">Nenhuma cobrança real foi realizada.</p><button className="btn btn-primary" onClick={()=>{location.hash='#shop'}}>Continuar explorando</button></div></main>
}

export function Contact() { return <main className="section-shell page"><div className="page-title"><span className="eyebrow">FALA COM A GENTE</span><h1>Contato</h1><p>Canal demonstrativo para dúvidas, trocas e pedidos.</p></div><div className="contact-grid"><div><strong>WhatsApp</strong><span>(12) 99999-0000</span></div><div><strong>Instagram</strong><span>@velora.store</span></div><div><strong>E-mail</strong><span>oi@velora.store</span></div></div></main> }

export function Empty({title,button}) { return <div className="empty"><img className="brand-mark brand-mark--standalone" src="/velora-mark.svg" alt="" aria-hidden="true"/><h2>{title}</h2><button className="btn btn-primary" onClick={()=>{location.hash='#shop'}}>{button}</button></div> }

export function Footer({ supabaseOnline }){return <footer><div className="section-shell footer-grid"><div><Brand/><p>Projeto acadêmico demonstrativo de e-commerce de moda urbana.</p></div><div><strong>Comprar</strong><button onClick={()=>{location.hash='#shop'}}>Loja</button><button>Novidades</button><button>Ofertas</button></div><div><strong>Ajuda</strong><button onClick={()=>{location.hash='#contact'}}>Contato</button><button>Trocas</button><button>Entrega</button></div><div><strong>Arquitetura</strong><span>POO · MVC</span><span>React → API REST → Supabase</span><span>Supabase Auth · RLS · pagamento fake</span><span className={`api-state ${supabaseOnline ? 'online' : 'offline'}`}>{supabaseOnline ? 'API + Supabase online' : 'API offline'}</span></div></div><div className="footer-bottom">© 2026 VELORA — conceito fictício para apresentação acadêmica.</div></footer>}
