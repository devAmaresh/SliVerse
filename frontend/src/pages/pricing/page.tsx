import { useEffect } from "react";
import List from "../../components/list";
import PricingCard from "../../components/PricingCard";
import { Header } from "../landing/components/Header";

const Page = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="md:px-24 px-5">
        <section className="relative z-10 overflow-hidden bg-white pb-12 pt-20 dark:bg-zinc-950 lg:pb-[90px] lg:pt-[120px]">
          <div className="container mx-auto">
            <div className="-mx-4 flex flex-wrap">
              <div className="w-full px-4">
                <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                  <div className="mb-3 text-3xl font-bold leading-[1.208] dark:text-white sm:text-4xl md:text-[40px]">
                    Our Pricing Plan
                  </div>
                  <p className="text-base text-body-color dark:text-zinc-400">
                    Choose the plan that suits your needs. From personal use to
                    enterprise-level features, we offer solutions for every
                    need.
                  </p>
                </div>
              </div>
            </div>

            <div className="-mx-4 flex flex-wrap justify-center">
              {/* Personal Plan */}
              <PricingCard
                type="Personal"
                price="$5"
                subscription="month"
                description="Perfect for using in personal projects or small client work."
                buttonText="Choose Personal"
              >
                <List>1 User</List>
                <List>AI-generated slide templates</List>
                <List>Basic customization (text, color themes)</List>
                <List>100 AI-generated slides per month</List>
                <List>3 Months support</List>
                <List>Cloud storage for projects</List>
              </PricingCard>

              {/* Business Plan */}
              <PricingCard
                type="Business"
                price="$10"
                subscription="month"
                description="Designed for teams with collaborative features and advanced customization."
                buttonText="Choose Business"
                active
              >
                <List>Up to 5 Users</List>
                <List>Advanced AI-generated slide templates</List>
                <List>Unlimited AI-generated slides</List>
                <List>Premium content library (images, icons, videos)</List>
                <List>Collaboration features (real-time editing)</List>
                <List>6 Months support</List>
                <List>Cloud storage (5 GB)</List>
                <List>Priority support</List>
              </PricingCard>

              {/* Professional/Enterprise Plan */}
              <PricingCard
                type="Enterprise/Professional"
                price="$30"
                subscription="month"
                description="For enterprises needing custom branding and advanced integrations."
                buttonText="Choose Enterprise"
              >
                <List>Unlimited Users</List>
                <List>
                  All AI-generated slide templates and enterprise customization
                </List>
                <List>Custom AI models for brand adaptation</List>
                <List>API access for integrations with CRM and tools</List>
                <List>Unlimited AI-generated slides</List>
                <List>Priority 24/7 support</List>
                <List>Cloud storage (1 TB)</List>
                <List>Custom analytics on slide performance</List>
              </PricingCard>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Page;
