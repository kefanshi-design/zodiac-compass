type Props = {
  data: {
    headline: string;
    paragraph1: string;
    paragraph2: string;
    mixTitle: string;
  };
};

export default function ReadingSection({ data }: Props) {
  return (
    <section className="py-10 px-6 border-b border-white/10">
      <div className="w-full max-w-sm mx-auto">
        <h2 className="text-xl font-semibold mb-4">Personalized Reading</h2>

        {/* Headline */}
        <p className="text-white font-semibold text-base leading-relaxed mb-3">
          {data.headline}
        </p>

        {/* Body 1 */}
        <p className="text-white/70 text-sm leading-relaxed mb-8">
          {data.paragraph1}
        </p>

        {/* Mix Title */}
        <h3 className="text-white font-semibold text-lg mb-3">
          {data.mixTitle}
        </h3>

        {/* Body 2 */}
        <p className="text-white/70 text-sm leading-relaxed">
          {data.paragraph2}
        </p>
      </div>
    </section>
  );
}
