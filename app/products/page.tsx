import Navbar from "@/components/layout/Navbar";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Navbar />

      <section className="p-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Products Dashboard
        </h2>

        <p className="mt-2 text-gray-600">
          You are successfully logged in.
        </p>
      </section>
    </main>
  );
}