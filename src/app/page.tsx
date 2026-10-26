import SearchForm from "@/components/SearchForm";

export default function Home() {
  return (
    <section className="hero">
      <h1>Book your stay</h1>
      <p className="muted">Pick your dates and see what is available.</p>
      <SearchForm />
    </section>
  );
}
