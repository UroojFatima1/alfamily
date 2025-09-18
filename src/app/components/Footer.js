export default function Footer() {
  return (
    <footer className="bg-[var(--card)] py-6 text-center text-sm text-[var(--muted)]">
      © {new Date().getFullYear()} Bank Alfalah – Internal Ride Sharing Platform
    </footer>
  );
}
