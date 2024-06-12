export default function HeaderNav({ children }) {
  return (
    <nav className='flex items-center gap-x-5'>
      {children}
    </nav>
  )
}