import { Collapse, type CollapseProps } from 'antd';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    key: '1',
    question: "How does the AI create presentations?",
    answer: "Our AI analyzes your content, understands the context, and applies professional design principles to create visually stunning slides. It considers factors like content hierarchy, visual balance, and brand consistency. The AI has been trained on millions of professional presentations to understand what makes a presentation effective and engaging."
  },
  {
    key: '2',
    question: "Can I customize the AI-generated designs?",
    answer: "Absolutely! While our AI creates beautiful presentations automatically, you have full control to customize every aspect of the design. This includes colors, layouts, fonts, animations, and transitions. You can also save your brand guidelines and custom templates for future use."
  },
  {
    key: '3',
    question: "What formats can I export my presentations in?",
    answer: "You can export your presentations in multiple formats including PPTX (PowerPoint), PDF, HTML, and Google Slides. You can also present directly from our platform with features like presenter notes, timer, and audience interaction tools."
  },
  {
    key: '4',
    question: "Is my content secure?",
    answer: "Yes, we take security seriously. All your content is encrypted both in transit and at rest using industry-standard encryption protocols. We use AWS for hosting with multiple security layers, and we never share your data with third parties. We are also GDPR and CCPA compliant."
  },
  {
    key: '5',
    question: "Do you offer team collaboration features?",
    answer: "Yes! Our platform supports real-time collaboration with features like simultaneous editing, commenting, version history, and role-based access control. Team members can work together on presentations from anywhere in the world."
  },
  {
    key: '6',
    question: "What kind of support do you provide?",
    answer: "We offer 24/7 customer support through multiple channels including live chat, email, and phone. Our support team is highly trained and can help with technical issues, design guidance, and best practices. Enterprise customers also get dedicated account managers."
  },
  {
    key: '7',
    question: "Can I import existing presentations?",
    answer: "Yes, you can import presentations from PowerPoint, Google Slides, and other popular formats. Our AI will analyze and enhance your existing slides while maintaining your content and branding. You can also import assets from other design tools."
  },
  {
    key: '8',
    question: "Do you offer an API?",
    answer: "Yes, we provide a comprehensive API that allows you to integrate our presentation generation capabilities into your own applications. This includes endpoints for creating slides, managing templates, and handling exports. Enterprise customers get priority API access and support."
  },
  {
    key: '9',
    question: "What about offline access?",
    answer: "While Sliverse.ai is primarily a cloud-based solution, you can download presentations for offline viewing and editing. Changes will sync back to the cloud when you're online again. We also offer a desktop app for Windows and Mac."
  },
  {
    key: '10',
    question: "How do you handle different languages?",
    answer: "Our platform supports multiple languages for both the interface and content creation. The AI can understand and generate content in various languages while maintaining proper typography and layout rules for each language."
  }
];

export function FAQ() {
  const items: CollapseProps['items'] = faqs.map(faq => ({
    key: faq.key,
    label: (
      <span className="text-lg font-semibold text-gray-900 dark:text-white">
        {faq.question}
      </span>
    ),
    children: (
      <p className="text-gray-600 dark:text-gray-300 text-lg">
        {faq.answer}
      </p>
    ),
    className: "mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
  }));

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Everything you need to know about Sliverse.ai
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Collapse
            items={items}
            expandIcon={({ isActive }) => 
              isActive ? (
                <Minus className="text-purple-600 dark:text-purple-400 mt-2" />
              ) : (
                <Plus className="text-purple-600 dark:text-purple-400 mt-2" />
              )
            }
            expandIconPosition='right'
            ghost
            className=""
          />
        </div>
      </div>
    </section>
  );
}