import Layout from "../components/Layout";
import BasicMeta from "../components/meta/BasicMeta";

export default function About() {
  return (
    <Layout>
      <BasicMeta url={"/about"} title="About" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">About</h1>
        <p className="text-lg text-muted-foreground">
          This is the about page. The header should be visible and responsive.
        </p>
      </div>
    </Layout>
  );
}
