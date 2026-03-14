 "use client";

const reviews = [
  {
    name: "Ahmed R.",
    location: "Islamabad",
    rating: 5,
    text: "RentGhars ne meri zindagi asaan kar di. Sirf 2 din mein apna perfect apartment Islamabad mein mil gaya. Bahut hi asan aur bharosemand platform hai!",
    initials: "AR",
  },
  {
    name: "Sana K.",
    location: "Lahore",
    rating: 5,
    text: "Listings bilkul sahi aur updated hain. Koi fake listing nahi mili. DHA Lahore mein ghar dhundna pehle bohat mushkil tha, ab RentGhars se ek din ka kaam hai.",
    initials: "SK",
  },
  {
    name: "Bilal M.",
    location: "Karachi",
    rating: 4,
    text: "Bohot achha experience raha. Contact karna asaan tha aur owner bhi genuine nikla. Definitely recommend karunga apne doston ko bhi.",
    initials: "BM",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 justify-center my-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-[#f0c040]" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-[#1a2332] py-20 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f0c040]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#f0c040]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#f0c040] text-sm font-semibold uppercase tracking-[0.3em] mb-3">
            Customer Stories
          </p>
          <h2 className="text-white text-4xl font-bold mb-4">
            Humare Khush Grahak
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#f0c040]" />
            <div className="w-2 h-2 rounded-full bg-[#f0c040]" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#f0c040]" />
          </div>
          <p className="text-white/50 text-sm mt-4 max-w-md mx-auto">
            Hazaaron logon ne apna ghar RentGhars se dhunda — yeh unki kahaniyan hain.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {reviews.map((review, index) => (
            <div
              key={review.name}
              className="flex flex-col items-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Avatar — floating above card */}
              <div className="relative z-10 mb-[-28px]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f0c040] to-[#c89a20] flex items-center justify-center shadow-lg shadow-[#f0c040]/20 ring-4 ring-[#1a2332]">
                  <span className="text-[#1a2332] font-bold text-lg tracking-wide">
                    {review.initials}
                  </span>
                </div>
              </div>

              {/* Card */}
              <div className="w-full bg-white/5 border border-white/10 rounded-2xl pt-10 pb-6 px-6 hover:bg-white/8 hover:border-[#f0c040]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#f0c040]/5 text-center">
                {/* Quote icon */}
                <svg
                  className="w-6 h-6 text-[#f0c040]/30 mx-auto mb-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  {review.text}
                </p>

                <div className="h-px bg-white/10 mb-4" />

                <p className="text-white font-semibold text-sm">{review.name}</p>
                <p className="text-[#f0c040] text-xs mb-1">{review.location}</p>
                <StarRating rating={review.rating} />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { value: "5,000+", label: "Khush Kiraaydaar" },
            { value: "342+", label: "Verified Listings" },
            { value: "4.9★", label: "Average Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[#f0c040] text-xl font-bold">{stat.value}</p>
              <p className="text-white/40 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}