import { Product } from '../models/Product.js'
import jacketPulse from '../assets/products/jacket-pulse.webp'
import blazerNox from '../assets/products/blazer-nox.webp'
import tailoredAxis from '../assets/products/tailored-axis.webp'
import hoodieAura from '../assets/products/hoodie-aura.webp'
import knitIvory from '../assets/products/knit-ivory.webp'
import satinDrift from '../assets/products/satin-drift.webp'
import sneakerFlux from '../assets/products/sneaker-flux.webp'
import bagLoop from '../assets/products/bag-loop.webp'

export const products = [
  new Product({
    id: 'jacket-pulse',
    name: 'Jacket Pulse',
    category: 'Jaquetas',
    price: 279.9,
    oldPrice: 329.9,
    badge: 'DESTAQUE',
    image: jacketPulse,
    colors: ['#111318', '#68517f'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Casaco estruturado com zíper frontal, bolsos utilitários e faixas violetas cruzadas na cintura.',
  }),
  new Product({
    id: 'blazer-nox',
    name: 'Blazer Nox',
    category: 'Jaquetas',
    price: 289.9,
    badge: 'NOVO',
    image: blazerNox,
    colors: ['#25262a', '#8f79a8'],
    sizes: ['P', 'M', 'G'],
    description: 'Blazer preto de modelagem ampla com forro lavanda e acabamento minimalista.',
  }),
  new Product({
    id: 'tailored-axis',
    name: 'Tailored Axis',
    category: 'Calças',
    price: 219.9,
    image: tailoredAxis,
    colors: ['#24252a', '#5f6067'],
    sizes: ['36', '38', '40', '42', '44'],
    description: 'Calça de alfaiataria preta com cintura alta, pregas frontais e perna ampla.',
  }),
  new Product({
    id: 'hoodie-aura',
    name: 'Hoodie Aura',
    category: 'Moletons',
    price: 189.9,
    oldPrice: 219.9,
    badge: '-14%',
    image: hoodieAura,
    colors: ['#c8b9db', '#eee9f4'],
    sizes: ['P', 'M', 'G'],
    description: 'Moletom cropped lilás, mangas amplas e toque macio para composições urbanas leves.',
  }),
  new Product({
    id: 'knit-ivory',
    name: 'Knit Ivory',
    category: 'Tricôs',
    price: 149.9,
    badge: 'BEST SELLER',
    image: knitIvory,
    colors: ['#eee9df', '#d6cfc3'],
    sizes: ['P', 'M', 'G'],
    description: 'Blusa canelada marfim de gola alta com acabamento delicado e linhas anatômicas.',
  }),
  new Product({
    id: 'satin-drift',
    name: 'Satin Drift',
    category: 'Saias',
    price: 169.9,
    image: satinDrift,
    colors: ['#151519', '#3e3448'],
    sizes: ['P', 'M', 'G', 'GG'],
    description: 'Saia midi preta acetinada, fluida e assimétrica para looks diurnos ou noturnos.',
  }),
  new Product({
    id: 'sneaker-flux',
    name: 'Sneaker Flux',
    category: 'Calçados',
    price: 249.9,
    oldPrice: 299.9,
    badge: '-17%',
    image: sneakerFlux,
    colors: ['#f5f3ef', '#b8a0d0'],
    sizes: ['37', '38', '39', '40', '41', '42'],
    description: 'Tênis branco de sola robusta com pequenos detalhes lilás e visual clean.',
  }),
  new Product({
    id: 'bag-loop',
    name: 'Bag Loop',
    category: 'Acessórios',
    price: 139.9,
    image: bagLoop,
    colors: ['#16171b', '#68517f'],
    sizes: ['Único'],
    description: 'Bolsa transversal preta com acabamento roxo, alça ajustável e ferragens metálicas.',
  }),
]

export const categories = [
  { name: 'Moletons', text: 'Camadas confortáveis para o dia todo.', image: hoodieAura },
  { name: 'Jaquetas', text: 'Texturas e recortes para destacar o look.', image: jacketPulse },
  { name: 'Calças', text: 'Modelagens urbanas e versáteis.', image: tailoredAxis },
  { name: 'Acessórios', text: 'Detalhes que fecham a composição.', image: bagLoop },
]
