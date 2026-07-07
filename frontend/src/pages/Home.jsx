import { useState, useEffect } from 'react';
import api from '../api/api';
import { useGothicPoetry } from '../context/GothicPoetryContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Skull, 
  Sparkles, 
  BookOpen, 
  Search, 
  Layers, 
  ArrowUpDown, 
  Eye, 
  X, 
  RefreshCw,
  ShoppingBag,
  CreditCard,
  MapPin,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Home = () => {
  const { user, token } = useAuth();
  const { poem, theme, loading: loadingPoem, error: errorPoem, invokeNewPoem } = useGothicPoetry();
  const navigate = useNavigate();
  
  const rootURL = api.defaults.baseURL.replace(/\/api\/?$/, '');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('none'); // none, price-asc, price-desc, name-asc
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  
  // Modal de detalles y Checkout
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [modalStep, setModalStep] = useState('details'); // details, checkout, success
  const [quantity, setQuantity] = useState(1);
  
  // Formulario de envío
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingName, setShippingName] = useState('');
  
  // Tarjeta simulada
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Estados de carga del checkout
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  // Inicializar formulario al seleccionar producto
  useEffect(() => {
    if (selectedProduct) {
      setModalStep('details');
      setSelectedVariant(null);
      setQuantity(1);
      setShippingName(user?.username || '');
      setShippingAddress(user?.direccion || '');
      setShippingPhone(user?.telefono || '');
      setCardNumber('');
      setCardExpiry('');
      setCardCVV('');
      setCheckoutError('');
      setCreatedOrder(null);
    }
  }, [selectedProduct, user]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('catalog/categorias/');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async (catId = null) => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      let url = 'catalog/productos/';
      if (catId) {
        url += `?categoria=${catId}`;
      }
      const response = await api.get(url);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setErrorProducts('El abismo impidió recuperar los productos.');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryClick = (catId) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
      fetchProducts(null);
    } else {
      setSelectedCategory(catId);
      fetchProducts(catId);
    }
  };

  const filteredProducts = products.filter(product => {
    return product.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (product.descripcion && product.descripcion.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return parseFloat(a.precio_base) - parseFloat(b.precio_base);
    if (sortBy === 'price-desc') return parseFloat(b.precio_base) - parseFloat(a.precio_base);
    if (sortBy === 'name-asc') return a.nombre.localeCompare(b.nombre);
    return 0;
  });

  // Clases estéticas Skull Rider fijas y planas
  const getThemeButtonClass = (isActive = false) => {
    if (isActive) {
      return 'bg-[#b30000] border-[#b30000] text-white rounded-none';
    }
    return 'bg-[#1c1c1c] border-white/10 text-neutral-300 hover:text-white hover:border-[#b30000] hover:bg-[#b30000]/10 rounded-none';
  };

  const getThemePrimaryBtnClass = () => {
    return 'bg-[#b30000] hover:bg-[#990000] text-white rounded-none font-bold tracking-widest';
  };

  const getPoemThemeExplanation = () => {
    if (theme === 'theme-cripta') {
      return {
        title: 'CRIPTA RIDER',
        desc: 'Poesía del abismo y tumbas. La interfaz adopta sutiles destellos púrpuras bajo el rigor de Skull Rider.',
        border: 'border-purple-900/40'
      };
    }
    if (theme === 'theme-vampirico') {
      return {
        title: 'CARMÍN RIDER',
        desc: 'Poesía de sangre y pasiones. Predomina el carmesí en su máxima expresión.',
        border: 'border-[#b30000]/40'
      };
    }
    return {
      title: 'NEBLINA RIDER',
      desc: 'Poesía de cuervos y niebla. Clásico diseño minimalista oscuro de alto contraste.',
      border: 'border-zinc-800'
    };
  };

  const explanation = getPoemThemeExplanation();

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingName.trim() || !shippingAddress.trim() || !shippingPhone.trim()) {
      setCheckoutError('Por favor completa todos los campos de entrega.');
      return;
    }
    if (!cardNumber.trim() || !cardExpiry.trim() || !cardCVV.trim()) {
      setCheckoutError('Por favor completa los datos de pago simulados.');
      return;
    }

    setCheckoutLoading(true);
    setCheckoutError('');

    const crearTokenCulqi = () => {
      return new Promise((resolve, reject) => {
        window.culqi = function () {
          if (window.Culqi.token) {
            resolve(window.Culqi.token.id);
          } else {
            reject(window.Culqi.error?.user_message || 'Tarjeta inválida');
          }
        };
        window.Culqi.createToken();
      });
    };

    try {
      // 1. Crear Orden
      const orderPayload = {
        estado: 'pendiente',
        items: [
          {
            variante: selectedVariant.id,
            cantidad: quantity,
            precio_unitario: parseFloat(selectedProduct.precio_base)
          }
        ]
      };
      
      const orderRes = await api.post('orders/ordenes/', orderPayload);
      const newOrder = orderRes.data;
      setCreatedOrder(newOrder);

      // 2. Cobrar Orden (Token real de Culqi)
      const culqiTokenId = await crearTokenCulqi();
      const paymentPayload = {
        orden_id: newOrder.id,
        token: culqiTokenId
      };

      await api.post('payments/cobrar/', paymentPayload);
      setModalStep('success');
    } catch (err) {
      console.error('Error procesando checkout:', err);
      const errMsg = err.response?.data?.detail || 'Error al procesar el pacto comercial con el abismo.';
      setCheckoutError(errMsg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="goth-transition font-skull-body pb-20 bg-[#111111] text-[#e2e8f0]">
      {/* Hero Banner */}
      <header className="relative py-24 px-6 md:px-12 text-center border-b border-white/10 bg-[#151515]">
        <div className="relative max-w-4xl mx-auto">
          <h1 className="font-skull-title text-5xl md:text-7xl font-black tracking-widest mb-6 text-white uppercase leading-none">
            SKULL <span className="text-[#b30000]">RIDER</span>
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-xl mx-auto mb-8 tracking-wider uppercase font-skull-nav">
            Indumentaria sin concesiones. Rige tu estilo bajo el dogma de la literatura oscura.
          </p>
          <a
            href="#catalogo"
            className={`goth-transition px-8 py-3.5 text-sm font-bold tracking-widest border transition-all duration-300 font-skull-nav ${getThemeButtonClass(true)}`}
          >
            DESCUBRIR CATÁLOGO
          </a>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LADO IZQUIERDO: Widget de Poesía (API Externa) */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          <div className={`goth-transition skull-panel rounded-none p-6 border ${explanation.border} relative overflow-hidden bg-[#1c1c1c]`}>
            {/* Cabecera del Widget */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10 font-skull-nav">
              <h2 className="text-lg font-bold tracking-widest flex items-center gap-2 text-white uppercase">
                <BookOpen className="w-5 h-5 text-[#b30000]" />
                Poesía Invocada
              </h2>
              <button
                onClick={invokeNewPoem}
                disabled={loadingPoem}
                className={`goth-transition p-2 border cursor-pointer ${getThemeButtonClass(false)} disabled:opacity-50`}
                title="Invocar otro poema de Edgar Allan Poe"
              >
                <RefreshCw className={`w-4 h-4 ${loadingPoem ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Contenido del poema */}
            {loadingPoem ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-2 border-[#b30000] border-t-transparent animate-spin mb-3 rounded-none"></div>
                <p className="text-xs text-neutral-500 font-skull-nav tracking-widest">Invocando el poema...</p>
              </div>
            ) : errorPoem ? (
              <div className="py-6 text-center text-xs text-[#b30000] font-bold tracking-wider">
                <p>{errorPoem}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-skull-title text-xl text-neutral-200 tracking-wider">
                    {poem?.title?.toUpperCase()}
                  </h3>
                  <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-widest font-skull-nav">Por {poem?.author}</p>
                </div>

                {/* Líneas del poema */}
                <div className="goth-transition max-h-48 overflow-y-auto bg-black/50 rounded-none p-4 border border-white/5 text-xs font-serif italic text-neutral-300 leading-relaxed scrollbar-thin">
                  {poem?.lines?.slice(0, 10).map((line, idx) => (
                    <p key={idx} className="mb-1">{line}</p>
                  ))}
                  {poem?.lines?.length > 10 && (
                    <p className="text-neutral-600 text-xs mt-2">...</p>
                  )}
                </div>

                {/* Explicación del tema */}
                <div className="mt-2 p-4 bg-black/30 border border-white/5 text-xs rounded-none font-skull-body">
                  <h4 className="font-bold text-white flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-skull-nav">
                    <Sparkles className="w-4 h-4 text-[#b30000]" />
                    {explanation.title}
                  </h4>
                  <p className="text-neutral-400 leading-normal text-[11px]">{explanation.desc}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* LADO DERECHO: Catálogo */}
        <section id="catalogo" className="lg:col-span-2 flex flex-col gap-6">
          {/* Filtros */}
          <div className="skull-panel rounded-none p-6 border border-white/10 flex flex-col gap-5">
            
            {/* Buscador */}
            <div className="relative rounded-none">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="BUSCAR INDUMENTARIA O RELIQUIAS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 text-neutral-200 border border-white/10 rounded-none pl-10 pr-4 py-3 text-xs tracking-wider uppercase focus:outline-none focus:border-[#b30000] focus:ring-1 focus:ring-[#b30000] goth-transition font-skull-nav"
              />
            </div>

            {/* Categorías */}
            <div className="font-skull-nav">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5 mb-3">
                <Layers className="w-4 h-4 text-[#b30000]" />
                Filtrar por Categoría
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryClick(null)}
                  className={`px-4 py-2 text-xs font-bold tracking-wider uppercase border cursor-pointer goth-transition ${getThemeButtonClass(selectedCategory === null)}`}
                >
                  Todos
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 text-xs font-bold tracking-wider uppercase border cursor-pointer goth-transition ${getThemeButtonClass(selectedCategory === cat.id)}`}
                  >
                    {cat.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 font-skull-nav tracking-wider text-xs">
              <div className="flex items-center gap-2 text-neutral-400">
                <ArrowUpDown className="w-4 h-4 text-neutral-500" />
                <span className="uppercase">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-neutral-900 border border-white/10 text-neutral-300 rounded-none px-3 py-1.5 text-xs tracking-wider uppercase focus:outline-none focus:border-[#b30000]"
                >
                  <option value="none">Sin Ordenar</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="name-asc">Nombre: A - Z</option>
                </select>
              </div>
              <div className="text-neutral-500 uppercase">
                {sortedProducts.length} productos
              </div>
            </div>

          </div>

          {/* Listado de Productos */}
          {loadingProducts ? (
            <div className="py-24 flex flex-col items-center justify-center skull-panel border border-white/10 rounded-none">
              <div className="w-10 h-10 border-4 border-[#b30000] border-t-transparent animate-spin mb-4 rounded-none"></div>
              <p className="text-xs text-neutral-400 font-skull-nav tracking-widest animate-pulse">
                INVOCANDO PRODUCTOS DEL ABISMO...
              </p>
            </div>
          ) : errorProducts ? (
            <div className="py-16 text-center skull-panel border border-white/10 rounded-none">
              <Skull className="w-12 h-12 text-[#b30000] mx-auto mb-3" />
              <p className="text-[#b30000] text-xs font-bold tracking-widest uppercase">{errorProducts}</p>
              <button 
                onClick={() => fetchProducts(selectedCategory)}
                className="mt-4 px-5 py-2.5 border border-[#b30000] rounded-none text-xs font-bold tracking-widest text-[#b30000] bg-[#b30000]/10 hover:bg-[#b30000] hover:text-white cursor-pointer transition-all duration-200"
              >
                REINTENTAR CONVOCATORIA
              </button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-20 text-center skull-panel border border-white/10 bg-neutral-950/20 rounded-none">
              <Skull className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
              <h3 className="font-skull-nav text-neutral-400 font-bold text-sm tracking-widest mb-1.5 uppercase">El Abismo está Vacío</h3>
              <p className="text-neutral-500 text-xs font-light max-w-xs mx-auto tracking-wide">
                No hay productos registrados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedProducts.map((product) => {
                const principalImg = product.imagenes?.find(img => img.es_principal) || product.imagenes?.[0];
                let imgUrl = '';
                if (principalImg) {
                  imgUrl = principalImg.imagen.startsWith('http') 
                    ? principalImg.imagen 
                    : `${rootURL}${principalImg.imagen}`;
                }

                return (
                  <article 
                    key={product.id}
                    className="goth-transition bg-[#1c1c1c] border border-white/10 hover:border-[#b30000] rounded-none overflow-hidden flex flex-col justify-between group hover:bg-[#252525]"
                  >
                    <div>
                      {/* Imagen */}
                      <div className="relative aspect-[4/3] bg-neutral-950 overflow-hidden flex items-center justify-center border-b border-white/10 rounded-none">
                        {imgUrl ? (
                          <img 
                            src={imgUrl} 
                            alt={product.nombre}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-out rounded-none"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-neutral-800 group-hover:text-[#b30000] transition-colors duration-300">
                            <Skull className="w-10 h-10" />
                            <span className="text-[9px] uppercase font-bold tracking-widest font-skull-nav">Sin Imagen</span>
                          </div>
                        )}
                        <span className="absolute top-0 left-0 bg-[#b30000] text-white text-[9px] uppercase tracking-widest px-2.5 py-1 font-bold font-skull-nav">
                          {product.categoria?.nombre || 'General'}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col gap-2">
                        <h3 className="font-skull-body text-sm font-bold text-neutral-100 uppercase tracking-wider group-hover:text-white transition-colors duration-200">
                          {product.nombre}
                        </h3>
                        <p className="text-neutral-400 text-xs font-light line-clamp-2 h-8 leading-relaxed">
                          {product.descripcion || 'Sin descripción detallada disponible.'}
                        </p>
                        
                        {/* Tallas */}
                        {product.variantes?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Array.from(new Set(product.variantes.map(v => v.talla).filter(Boolean))).map(talla => (
                              <span key={talla} className="text-[9px] font-bold bg-black/60 border border-white/10 text-neutral-400 px-2 py-0.5 rounded-none uppercase tracking-wider font-skull-nav">
                                {talla}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Tarjeta */}
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-white/10 mt-auto pt-4 bg-black/20 rounded-none">
                      <div>
                        <span className="text-neutral-500 text-[9px] uppercase tracking-widest block font-skull-nav">Precio</span>
                        <span className="text-lg font-bold text-[#b30000] font-skull-body">
                          ${parseFloat(product.precio_base).toFixed(2)}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="goth-transition flex items-center gap-1.5 px-4 py-2 rounded-none text-xs font-bold tracking-wider uppercase cursor-pointer border border-[#b30000] text-[#b30000] hover:bg-[#b30000] hover:text-white font-skull-nav"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Detalles
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

      </div>

      {/* MODAL DE DETALLES DEL PRODUCTO / CHECKOUT */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs">
          <div 
            className="goth-transition bg-[#1c1c1c] border border-[#b30000] rounded-none w-full max-w-2xl overflow-hidden shadow-2xl relative animate-[fadeIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-none bg-black/50 border border-white/10 hover:border-[#b30000] text-neutral-400 hover:text-white cursor-pointer transition-colors duration-200 z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* PASO 1: DETALLES DEL PRODUCTO */}
            {modalStep === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Imagen */}
                <div className="bg-neutral-950 border-r border-white/10 aspect-square flex items-center justify-center relative rounded-none">
                  {(() => {
                    const principalImg = selectedProduct.imagenes?.find(img => img.es_principal) || selectedProduct.imagenes?.[0];
                    if (principalImg) {
                      const imgUrl = principalImg.imagen.startsWith('http') 
                        ? principalImg.imagen 
                        : `${rootURL}${principalImg.imagen}`;
                      return <img src={imgUrl} alt={selectedProduct.nombre} className="object-cover w-full h-full rounded-none" />;
                    }
                    return (
                      <div className="flex flex-col items-center gap-2 text-neutral-800">
                        <Skull className="w-16 h-16" />
                        <span className="text-[10px] uppercase font-bold tracking-widest font-skull-nav">Sin Imagen</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Info */}
                <div className="p-6 md:p-8 flex flex-col justify-between h-full max-h-[500px] overflow-y-auto">
                  <div className="flex flex-col gap-4">
                    <div className="font-skull-nav">
                      <span className="text-[10px] uppercase font-bold text-[#b30000] tracking-widest">
                        {selectedProduct.categoria?.nombre || 'General'}
                      </span>
                      <h3 className="font-skull-body text-xl font-bold text-white mt-1 uppercase tracking-wider">
                        {selectedProduct.nombre}
                      </h3>
                    </div>

                    <div className="text-2xl font-bold text-[#b30000] font-skull-body">
                      ${parseFloat(selectedProduct.precio_base).toFixed(2)}
                    </div>

                    <div className="border-t border-b border-white/10 py-4 flex flex-col gap-2.5 font-skull-body">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-skull-nav">Descripción</h4>
                      <p className="text-neutral-300 text-xs font-light leading-relaxed">
                        {selectedProduct.descripcion || 'Este objeto ritualístico no tiene descripción registrada en el catálogo.'}
                      </p>
                    </div>

                    {/* Selección de Variante */}
                    {selectedProduct.variantes?.length > 0 ? (
                      <div className="flex flex-col gap-2.5 font-skull-body">
                        <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 font-skull-nav">
                          Selecciona una Variante
                        </h4>
                        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-2">
                          {selectedProduct.variantes.map((variant) => (
                            <div 
                              key={variant.id}
                              onClick={() => variant.stock > 0 && setSelectedVariant(variant)}
                              className={`flex items-center justify-between text-xs bg-black/30 border px-3 py-2.5 rounded-none cursor-pointer goth-transition ${
                                selectedVariant?.id === variant.id 
                                  ? 'border-[#b30000] bg-[#b30000]/10 text-white font-bold' 
                                  : 'border-white/5 hover:border-white/20 text-neutral-400'
                              } ${variant.stock === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                              <span>
                                Talla: <strong className="uppercase">{variant.talla || 'N/A'}</strong> | Color: <strong className="uppercase">{variant.color || 'N/A'}</strong>
                              </span>
                              <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider ${
                                variant.stock > 0 ? 'text-green-400 font-semibold' : 'text-rose-500 font-semibold'
                              }`}>
                                {variant.stock > 0 ? `${variant.stock} Disponibles` : 'Agotado'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-500 font-light bg-black/20 p-3 rounded-none border border-white/5 text-center font-skull-nav uppercase tracking-wider">
                        No hay variantes registradas.
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 font-skull-nav">
                    {!token ? (
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          navigate('/login');
                        }}
                        className="w-full py-3.5 text-center text-xs font-bold tracking-widest text-white bg-zinc-800 hover:bg-[#b30000] goth-transition cursor-pointer uppercase"
                      >
                        Iniciar Sesión para Reservar
                      </button>
                    ) : (
                      <button
                        disabled={!selectedVariant}
                        onClick={() => setModalStep('checkout')}
                        className={`w-full py-3.5 text-xs font-bold tracking-widest flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${
                          selectedVariant 
                            ? getThemePrimaryBtnClass() 
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed shadow-none'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        {selectedVariant ? 'PROCEDER AL CHECKOUT' : 'SELECCIONA UNA VARIANTE'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* PASO 2: FORMULARIO DE CHECKOUT (PASARELA SIMULADA) */}
            {modalStep === 'checkout' && (
              <form onSubmit={handleCheckoutSubmit} className="p-6 md:p-8 flex flex-col gap-6">
                
                {/* Cabecera */}
                <div className="flex items-center gap-2 pb-3 border-b border-white/10 font-skull-nav">
                  <button 
                    type="button"
                    onClick={() => setModalStep('details')}
                    className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-lg font-black tracking-widest text-white uppercase flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#b30000]" />
                    CHECKOUT SIMULADO
                  </h3>
                </div>

                {checkoutError && (
                  <div className="p-3 bg-black border-l-4 border-[#b30000] text-neutral-300 text-xs rounded-none flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#b30000]" />
                    <p className="leading-relaxed font-skull-body">{checkoutError}</p>
                  </div>
                )}

                {/* Resumen del Item */}
                <div className="bg-black/30 border border-white/5 p-4 flex justify-between items-center text-xs font-skull-nav">
                  <div>
                    <h4 className="text-white font-bold tracking-wider">{selectedProduct.nombre.toUpperCase()}</h4>
                    <p className="text-neutral-500 mt-1 uppercase">
                      Talla: {selectedVariant.talla} | Color: {selectedVariant.color}
                    </p>
                  </div>
                  
                  {/* Cantidad */}
                  <div className="flex items-center gap-3">
                    <label className="text-neutral-400">CANTIDAD:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max={selectedVariant.stock} 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 bg-black border border-white/10 text-center py-1 text-white focus:outline-none focus:border-[#b30000]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Formulario de Envío */}
                  <div className="flex flex-col gap-4 font-skull-nav">
                    <h4 className="text-xs font-bold text-neutral-400 tracking-widest uppercase flex items-center gap-1.5 border-b border-white/5 pb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#b30000]" />
                      Detalles de Entrega
                    </h4>
                    
                    {/* Nombre */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-500 uppercase font-semibold">Nombre del Destinatario</label>
                      <input 
                        type="text" 
                        required
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        className="bg-black/50 border border-white/10 text-white px-3 py-2 text-xs tracking-wider uppercase focus:outline-none focus:border-[#b30000]"
                      />
                    </div>

                    {/* Dirección */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-500 uppercase font-semibold">Dirección de Envío</label>
                      <input 
                        type="text" 
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="bg-black/50 border border-white/10 text-white px-3 py-2 text-xs tracking-wider uppercase focus:outline-none focus:border-[#b30000]"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-500 uppercase font-semibold">Teléfono de Enlace</label>
                      <input 
                        type="text" 
                        required
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        className="bg-black/50 border border-white/10 text-white px-3 py-2 text-xs tracking-wider focus:outline-none focus:border-[#b30000]"
                      />
                    </div>
                  </div>

                  {/* Formulario de Pago */}
                  <div className="flex flex-col gap-4 font-skull-nav">
                    <h4 className="text-xs font-bold text-neutral-400 tracking-widest uppercase flex items-center gap-1.5 border-b border-white/5 pb-1">
                      <CreditCard className="w-3.5 h-3.5 text-[#b30000]" />
                      Pago Simulado
                    </h4>

                    {/* Número de Tarjeta */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-neutral-500 uppercase font-semibold">Número de Tarjeta</label>
                      <input 
                        type="text" 
                        maxLength="19"
                        required
                        placeholder="4556 •••• •••• ••••"
                        id="card[number]"
                        data-culqi="card[number]"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                        className="bg-black/50 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#b30000]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Vencimiento */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-neutral-500 uppercase font-semibold">Vencimiento</label>
                        <input 
                          type="text" 
                          maxLength="5"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="bg-black/50 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#b30000] text-center"
                        />
                      </div>
                      
                      {/* CVV */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] text-neutral-500 uppercase font-semibold">CVV</label>
                        <input 
                          type="password" 
                          maxLength="3"
                          required
                          placeholder="•••"
                          id="card[cvv]"
                          data-culqi="card[cvv]"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          className="bg-black/50 border border-white/10 text-white px-3 py-2 text-xs focus:outline-none focus:border-[#b30000] text-center"
                        />
                      </div>
                    </div>

                    <input type="hidden" id="card[exp_month]" data-culqi="card[exp_month]" value={cardExpiry.split('/')[0] || ''} readOnly />
                    <input type="hidden" id="card[exp_year]" data-culqi="card[exp_year]" value={cardExpiry.split('/')[1] ? '20' + cardExpiry.split('/')[1] : ''} readOnly />
                    <input type="hidden" id="card[email]" data-culqi="card[email]" value={user?.email || 'cliente@altbasement.com'} readOnly />
                    
                    <span className="text-[9px] text-neutral-500 uppercase italic mt-1 leading-normal">
                      * El cobro es una simulación local. No se realizarán transacciones monetarias reales.
                    </span>
                  </div>

                </div>

                {/* Footer Checkout */}
                <div className="border-t border-white/10 pt-5 mt-4 flex flex-col md:flex-row justify-between items-center gap-4 font-skull-nav">
                  <div className="text-center md:text-left">
                    <span className="text-neutral-500 text-[10px] uppercase tracking-widest block">Total Acumulado</span>
                    <span className="text-2xl font-bold text-[#b30000] font-skull-body">
                      ${(parseFloat(selectedProduct.precio_base) * quantity).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={checkoutLoading}
                    className={`px-8 py-3.5 text-xs font-bold tracking-widest cursor-pointer transition-all duration-300 w-full md:w-auto ${getThemePrimaryBtnClass()}`}
                  >
                    {checkoutLoading ? 'PROCESANDO PACTO...' : 'CONFIRMAR PACTO COMERCIAL'}
                  </button>
                </div>

              </form>
            )}

            {/* PASO 3: ÉXITO EN COMPRA */}
            {modalStep === 'success' && (
              <div className="p-8 flex flex-col items-center justify-center text-center gap-6">
                <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
                
                <div className="font-skull-nav">
                  <h3 className="text-2xl font-black tracking-widest text-white uppercase">
                    ¡PACTO CONCRETADO CON ÉXITO!
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 max-w-sm leading-relaxed uppercase tracking-wider">
                    Tu orden de compra ha sido registrada y pagada en los archivos de AltBasement.
                  </p>
                </div>

                {/* Detalles de la orden */}
                <div className="bg-black/30 border border-white/10 p-5 w-full max-w-md text-xs font-skull-nav flex flex-col gap-2.5">
                  <div className="flex justify-between border-b border-white/5 pb-2 text-neutral-400">
                    <span>NÚMERO DE ORDEN:</span>
                    <strong className="text-white">#{createdOrder?.id}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-neutral-400">
                    <span>TOTAL PAGADO:</span>
                    <strong className="text-[#b30000] font-skull-body text-sm">${parseFloat(createdOrder?.total || 0).toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2 text-neutral-400">
                    <span>DESTINATARIO:</span>
                    <strong className="text-white uppercase">{shippingName}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>DIRECCIÓN DE ENVÍO:</span>
                    <strong className="text-white uppercase truncate max-w-[200px]">{shippingAddress}</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4 font-skull-nav">
                  <button
                    onClick={() => {
                      setSelectedProduct(null);
                      navigate('/dashboard');
                    }}
                    className="flex-1 py-3 text-xs font-bold tracking-widest bg-zinc-800 text-white hover:bg-white hover:text-black goth-transition cursor-pointer uppercase"
                  >
                    Ir a mis Órdenes
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 py-3 text-xs font-bold tracking-widest bg-[#b30000] hover:bg-[#990000] text-white goth-transition cursor-pointer uppercase"
                  >
                    Seguir Comprando
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
