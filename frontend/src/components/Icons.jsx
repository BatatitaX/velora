const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const Icon = ({ children, size = 22, ...props }) => <svg {...base} width={size} height={size} {...props}>{children}</svg>
export const Menu = (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>
export const X = (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>
export const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></Icon>
export const User = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.4-4 4.1-6 8-6s6.6 2 8 6"/></Icon>
export const Heart = (p) => <Icon {...p}><path d="M20.8 4.6c-1.8-1.8-4.7-1.8-6.5 0L12 6.9 9.7 4.6a4.6 4.6 0 0 0-6.5 6.5L12 20l8.8-8.9a4.6 4.6 0 0 0 0-6.5z"/></Icon>
export const Bag = (p) => <Icon {...p}><path d="M5 8h14l-1 13H6z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></Icon>
export const Arrow = (p) => <Icon {...p}><path d="M5 12h14M14 7l5 5-5 5"/></Icon>
export const Sun = (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></Icon>
export const Moon = (p) => <Icon {...p}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8z"/></Icon>
export const Truck = (p) => <Icon {...p}><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></Icon>
export const Shield = (p) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></Icon>
export const Refresh = (p) => <Icon {...p}><path d="M20 6v5h-5M4 18v-5h5"/><path d="M18.5 9a7 7 0 0 0-12-2L4 11M5.5 15a7 7 0 0 0 12 2L20 13"/></Icon>
