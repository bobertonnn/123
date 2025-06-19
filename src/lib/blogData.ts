
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string; // ISO string or formatted string
  imageUrl: string;
  imageHint: string;
  excerpt: string;
  content: string; // Simple text or basic markdown-like
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'the-future-of-e-signatures',
    title: 'The Future of E-Signatures: Trends to Watch in 2024',
    author: 'Alice Wonderland',
    date: '2024-07-15',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'futuristic digital signature',
    excerpt: 'Explore the evolving landscape of electronic signatures and how new technologies are shaping their future...',
    content: `
<p>The world of electronic signatures is constantly evolving. As businesses increasingly adopt digital workflows, the demand for more secure, efficient, and user-friendly e-signature solutions grows. In 2024, several key trends are set to redefine how we think about and use e-signatures.</p>
<br/>
<h3 class="text-xl font-semibold mb-2">Trend 1: Enhanced Security with AI and Blockchain</h3>
<p>Artificial intelligence (AI) is playing a larger role in verifying signer identities and detecting fraudulent activities. Blockchain technology offers potential for immutable audit trails, further enhancing the trustworthiness of signed documents. Expect to see more solutions integrating these advanced security layers.</p>
<br/>
<h3 class="text-xl font-semibold mb-2">Trend 2: Mobile-First Signing Experiences</h3>
<p>With a significant portion of business conducted on mobile devices, e-signature platforms are prioritizing seamless mobile experiences. This includes responsive design, intuitive touch interfaces, and offline signing capabilities.</p>
<br/>
<h3 class="text-xl font-semibold mb-2">Trend 3: Deeper Integrations and Automation</h3>
<p>E-signature solutions are becoming more deeply embedded into other business systems like CRMs, ERPs, and HR management tools. This allows for greater automation of document workflows, reducing manual effort and speeding up processes from start to finish.</p>
<br/>
<p>At DocuSigner, we are committed to staying at the forefront of these trends, continuously innovating to provide you with the best possible e-signature experience.</p>
    `,
  },
  {
    id: '2',
    slug: '5-tips-for-streamlining-document-workflows',
    title: '5 Tips for Streamlining Your Document Workflows',
    author: 'Bob The Builder',
    date: '2024-06-28',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'organized desk workflow',
    excerpt: 'Learn how to optimize your document processes for maximum efficiency and productivity...',
    content: `
<p>Inefficient document workflows can be a major drain on productivity. Here are five tips to help you streamline your processes:</p>
<br/>
<ol class="list-decimal list-inside space-y-2">
  <li><strong>Use Templates:</strong> For frequently used documents like contracts or onboarding forms, create templates to save time and ensure consistency.</li>
  <li><strong>Automate Reminders:</strong> Set up automatic reminders for signers to reduce follow-up time and keep documents moving.</li>
  <li><strong>Centralize Storage:</strong> Keep all your signed documents in a secure, centralized location for easy access and management.</li>
  <li><strong>Integrate with Other Tools:</strong> Connect your e-signature solution with other business applications (CRM, cloud storage) to automate data transfer and reduce manual entry.</li>
  <li><strong>Establish Clear Signing Orders:</strong> If multiple people need to sign, define a clear signing order to ensure the document flows through the correct sequence efficiently.</li>
</ol>
<br/>
<p>By implementing these tips, you can significantly improve the speed and efficiency of your document-centric tasks.</p>
    `,
  },
  {
    id: '3',
    slug: 'understanding-the-legality-of-e-signatures',
    title: 'Understanding the Legality of E-Signatures Globally',
    author: 'Charlie Brown',
    date: '2024-05-10',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'gavel legal document',
    excerpt: 'A look into the legal frameworks that make electronic signatures valid and enforceable around the world...',
    content: `
<p>Electronic signatures are legally binding in most countries around the world, thanks to specific laws and regulations designed to govern their use. Key legislation includes the ESIGN Act in the United States, eIDAS in the European Union, and similar laws in many other jurisdictions.</p>
<br/>
<h3 class="text-xl font-semibold mb-2">What Makes an E-Signature Legally Binding?</h3>
<p>Generally, for an e-signature to be considered legally valid, it must meet certain criteria:</p>
<ul class="list-disc list-inside space-y-1">
  <li><strong>Intent to Sign:</strong> The signer must demonstrate a clear intention to sign the document electronically.</li>
  <li><strong>Consent to Electronic Business:</strong> Signers must typically consent to conducting business electronically.</li>
  <li><strong>Association of Signature with Record:</strong> The system must be able to link the signature to the signed document.</li>
  <li><strong>Record Retention:</strong> The signed document must be stored in a way that ensures its integrity and accessibility for future reference.</li>
  <li><strong>Audit Trail:</strong> A comprehensive audit trail capturing all actions related to the signing process is crucial.</li>
</ul>
<br/>
<p>DocuSigner is designed with these principles in mind, providing features that support the creation of legally enforceable electronic signatures (though specific legal advice should always be sought for your jurisdiction and use case).</p>
    `,
  },
];
