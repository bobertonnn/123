
// THIS IS A MINIMAL TEST LAYOUT FOR THE (public) GROUP

export default function MinimalPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("--- MINIMAL PUBLIC LAYOUT IS RENDERING ---"); // Specific log for this test
  return (
    <div style={{ border: '10px solid limegreen', padding: '20px', backgroundColor: '#e0ffe0', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'lightcoral', padding: '10px', textAlign: 'center', fontSize: '2em', color: 'white' }}>
        MINIMAL PUBLIC HEADER (from (public)/layout.tsx)
      </header>
      <main style={{ border: '5px dashed blue', padding: '15px', margin: '20px 0', backgroundColor: 'white' }}>
        {children}
      </main>
      <footer style={{ backgroundColor: 'lightskyblue', padding: '10px', textAlign: 'center', fontSize: '2em', color: 'white', marginTop: '20px' }}>
        MINIMAL PUBLIC FOOTER (from (public)/layout.tsx)
      </footer>
    </div>
  );
}
