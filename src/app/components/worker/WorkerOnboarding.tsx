import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function WorkerOnboarding() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#DBEAFE' }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path d="M40 10C30 10 25 15 25 20C25 25 30 30 40 30C50 30 55 25 55 20C55 15 50 10 40 10Z" fill="#FF6B00"/>
                <rect x="20" y="30" width="40" height="40" rx="5" fill="#0EA5E9"/>
                <circle cx="60" cy="50" r="10" fill="#FFD700"/>
              </svg>
            </div>
          </div>
        </div>
      ),
      headline: 'Your wallet, active automatically.',
      subtext: 'Swiggy set up your GigShield account. No forms, no apps, no hassle.'
    },
    {
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center relative">
            <div className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center" style={{ background: '#0EA5E9' }}>
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="25" fill="white" opacity="0.3"/>
                <circle cx="30" cy="30" r="15" fill="white"/>
              </svg>
            </div>
            <div className="absolute -right-4 top-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FF6B00' }}>
              <span className="text-white font-bold">S</span>
            </div>
            <div className="absolute -left-4 top-12 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#1C1C1C' }}>
              <span className="text-white font-bold">B</span>
            </div>
            <div className="absolute -right-2 bottom-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#FFD700' }}>
              <span className="text-black font-bold">O</span>
            </div>
          </div>
        </div>
      ),
      headline: 'Every delivery earns you more.',
      subtext: 'Rs 1.60 from every Rs 80 delivery grows your insurance and pension. See it happen in real time.'
    },
    {
      illustration: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-2xl flex items-center justify-center" style={{ background: '#F0FDF4' }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <path d="M40 10L45 25L60 27L47 38L51 53L40 45L29 53L33 38L20 27L35 25L40 10Z" fill="#22C55E"/>
              </svg>
            </div>
          </div>
        </div>
      ),
      headline: 'Your income, finally verified.',
      subtext: 'After 18 months, unlock a personal loan — even without a salary slip.'
    }
  ];

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8FAFC' }}>
      {/* Top illustration area */}
      <div className="relative" style={{ height: '56%', background: '#EFF6FF', borderRadius: '0 0 32px 32px' }}>
        <button
          onClick={() => navigate('/worker/home')}
          className="absolute top-4 right-4"
          style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '13px', color: '#64748B' }}
        >
          Skip
        </button>
        {currentSlideData.illustration}
      </div>

      {/* Bottom content */}
      <div className="flex-1 px-8 pt-8 flex flex-col">
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '24px', color: '#0F172A' }}>
          {currentSlideData.headline}
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#64748B', lineHeight: '1.6', marginTop: '8px' }}>
          {currentSlideData.subtext}
        </p>

        <div className="flex-1" />

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                width: index === currentSlide ? '24px' : '8px',
                height: '8px',
                borderRadius: '100px',
                background: index === currentSlide ? '#0EA5E9' : '#CBD5E1',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        {/* Button */}
        <button
          onClick={() => {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(currentSlide + 1);
            } else {
              navigate('/worker/home');
            }
          }}
          className="w-full rounded-md mb-6"
          style={{
            height: '48px',
            background: currentSlide === slides.length - 1 ? '#1A3C5E' : '#0EA5E9',
            color: '#FFFFFF',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '15px'
          }}
        >
          {currentSlide === slides.length - 1 ? 'Go to My Wallet' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
