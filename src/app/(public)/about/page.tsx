
// THIS IS A MINIMAL TEST PAGE FOR /about

export default function MinimalAboutUsPage() {
  console.log("--- MINIMAL ABOUT US PAGE IS RENDERING ---"); // Specific log for this test
  return (
    <div style={{ padding: '20px', border: '2px solid orange' }}>
      <h1 style={{ fontSize: '2em', color: 'orange', textAlign: 'center' }}>
        Minimal About Us Page Content
      </h1>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        If you see this inside a LIME GREEN BORDER with a LIGHTCORAL header and LIGHTSKYBLUE footer,
        then the (public) layout is working.
      </p>
    </div>
  );
}
