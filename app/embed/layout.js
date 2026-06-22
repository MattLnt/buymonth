export const metadata = {
  title: 'BuyMonth Badge',
}

export default function EmbedLayout({ children }) {
  return (
    <div style={{ margin: 0, padding: 0, background: 'transparent' }}>
      {children}
    </div>
  )
}