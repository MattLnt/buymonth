export default function Logo({ dark = false, height = 24 }) {
  return (
    <img
      src={dark ? '/fiderio-horizontal-white.svg' : '/fiderio-horizontal-dark.svg'}
      alt="Fiderio"
      style={{ height, width: 'auto', display: 'block' }}
    />
  );
}