export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} NewsIt. All rights reserved.</p>
        <p className="mt-1">Crafted with care for curious minds.</p>
      </div>
    </footer>
  );
}
