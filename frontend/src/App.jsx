import { useCallback, useEffect, useMemo, useState } from 'react'
import { eventBus } from './core/EventBus.js'
import { products as fallbackProducts, categories } from './data/catalog.js'
import { StoreController } from './controllers/StoreController.js'
import { SaleController } from './controllers/SaleController.js'
import { CustomerController } from './controllers/CustomerController.js'
import { FavoritesController } from './controllers/FavoritesController.js'
import { SupabaseService } from './services/SupabaseService.js'
import { Header, Home, Shop, ProductPage, Cart, Favorites, Profile, Contact, Footer, SaleSuccess } from './views/StorefrontViews.jsx'

export default function App() {
  const controllers = useMemo(() => {
    const supabase = new SupabaseService()
    const store = new StoreController(fallbackProducts, categories)
    return {
      supabase,
      store,
      sale: new SaleController(store, eventBus, supabase),
      customer: new CustomerController(eventBus, supabase),
      favorites: new FavoritesController(eventBus),
    }
  }, [])

  const [theme, setTheme] = useState(() => localStorage.getItem('velora-theme') || 'dark')
  const [favorites, setFavorites] = useState([])
  const [sale, setSale] = useState(() => controllers.sale.snapshot())
  const [customer, setCustomer] = useState(null)
  const [completedSale, setCompletedSale] = useState(null)
  const [hash, setHash] = useState(location.hash || '#home')
  const [catalogRevision, setCatalogRevision] = useState(0)
  const [supabaseOnline, setSupabaseOnline] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('velora-theme', theme)
  }, [theme])

  useEffect(() => {
    const onHashChange = () => {
      setHash(location.hash || '#home')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    let active = true
    const connectSupabase = async () => {
      try {
        await controllers.supabase.checkConnection()
        const remoteProducts = await controllers.supabase.listProducts()
        if (!active) return

        // As imagens do modelo continuam empacotadas pelo Vite; o Supabase fornece
        // os dados reais do catálogo e a imagem local é conciliada pelo id.
        const productsWithLocalImages = remoteProducts.map((product) => ({
          ...product,
          image: fallbackProducts.find((fallback) => fallback.id === product.id)?.image || product.image,
        }))

        controllers.store.replaceProducts(productsWithLocalImages)
        setCatalogRevision((value) => value + 1)
        setSupabaseOnline(true)
      } catch (error) {
        console.warn('Supabase indisponível; catálogo visual de fallback mantido.', error)
        if (active) setSupabaseOnline(false)
      }
    }

    connectSupabase()
    return () => { active = false }
  }, [controllers])

  useEffect(() => {
    const unsubscribeSale = eventBus.on('sale:changed', ({ sale: nextSale }) => setSale(nextSale))
    const unsubscribeFavorites = eventBus.on('favorites:changed', setFavorites)
    const unsubscribeCustomer = eventBus.on('customer:changed', (nextCustomer) => {
      setCustomer(nextCustomer)
      controllers.sale.attachCustomer(nextCustomer)
    })
    const unsubscribeCompleted = eventBus.on('sale:completed', (finishedSale) => {
      setCompletedSale(finishedSale)
      location.hash = '#success'
    })
    return () => {
      unsubscribeSale()
      unsubscribeFavorites()
      unsubscribeCustomer()
      unsubscribeCompleted()
    }
  }, [controllers])

  useEffect(() => {
    // A sessão é dirigida pelo Supabase Auth: login, logout, refresh e retorno
    // de confirmação de e-mail atualizam a interface automaticamente.
    const unsubscribeAuth = controllers.customer.watchAuth()
    return unsubscribeAuth
  }, [controllers])

  const allProducts = useMemo(() => controllers.store.listProducts(), [controllers, catalogRevision])
  const openProduct = (id) => { location.hash = `#product/${id}` }
  const productId = hash.startsWith('#product/') ? hash.split('/')[1] : null
  const product = productId ? controllers.store.findProduct(productId) : null

  const registerCustomer = (data) => controllers.customer.register(data)
  const loginCustomer = (data) => controllers.customer.login(data)
  const recoverPassword = (email) => controllers.customer.recoverPassword(email)
  const updateProfile = (data) => controllers.customer.updateProfile(data)
  const logoutCustomer = () => controllers.customer.logout()
  const uploadAvatar = (file) => controllers.customer.uploadAvatar(file)

  const loadSales = useCallback(() => controllers.sale.history(), [controllers])

  const finalizeSale = async () => {
    if (!customer) {
      location.hash = '#profile'
      return
    }
    return controllers.sale.finalize(customer)
  }

  let view
  if (product) {
    view = <ProductPage product={product} favorite={favorites.includes(product.id)} onFavorite={(id) => controllers.favorites.toggle(id)} addCart={(id, options) => controllers.sale.addProduct(id, options)} />
  } else if (hash === '#shop') {
    view = <Shop controller={controllers.store} favorites={favorites} onFavorite={(id) => controllers.favorites.toggle(id)} onOpen={openProduct} />
  } else if (hash === '#cart') {
    view = <Cart sale={sale} removeItem={(index) => controllers.sale.removeItem(index)} onOpen={openProduct} customer={customer} onFinalize={finalizeSale} onCalculateShipping={(cep) => controllers.sale.calculateShipping(cep)} supabaseOnline={supabaseOnline} />
  } else if (hash === '#favorites') {
    view = <Favorites products={allProducts} favorites={favorites} onFavorite={(id) => controllers.favorites.toggle(id)} onOpen={openProduct} />
  } else if (hash === '#profile') {
    view = <Profile customer={customer} onLogin={loginCustomer} onRegister={registerCustomer} onRecover={recoverPassword} onUpdateProfile={updateProfile} onLogout={logoutCustomer} onLoadSales={loadSales} onUploadAvatar={uploadAvatar} supabaseOnline={supabaseOnline} />
  } else if (hash === '#contact') {
    view = <Contact />
  } else if (hash === '#success' && completedSale) {
    view = <SaleSuccess sale={completedSale} />
  } else {
    view = <Home products={allProducts} categories={controllers.store.categoryCards} favorites={favorites} onFavorite={(id) => controllers.favorites.toggle(id)} onOpen={openProduct} />
  }

  return <div className="app">
    <Header cartCount={sale.items.length} favoriteCount={favorites.length} theme={theme} setTheme={setTheme} />
    {view}
    <Footer supabaseOnline={supabaseOnline} />
  </div>
}
