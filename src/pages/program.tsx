import Layout from "../components/Layout";
import BasicMeta from "../components/meta/BasicMeta";

export default function Program() {
  return (
    <Layout>
      <BasicMeta url={"/program"} title="Program" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Program</h1>
        <p className="text-lg text-muted-foreground">
          This is the program page. The header should be visible and responsive.
        </p>
      </div>
    </Layout>
  );
}
