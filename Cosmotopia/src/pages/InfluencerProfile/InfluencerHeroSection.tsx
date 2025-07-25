import { forwardRef, useMemo } from 'react';
import ReviewBackground from '@/assets/kol/review_background.png';
import type { KOLVideoDTO } from './types/influencer';

interface HeroSectionProps {
  affiliateProfileId?: string; // Chỉ nhận để đồng bộ, không dùng bên trong component
  video: KOLVideoDTO | null;
}

const sanitizeEmbedUrl = (raw?: string) => {
  if (!raw) return '';
  const [base, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  params.set('autoplay', '1');
  params.set('rel', '0');
  params.set('controls', '1');
  return `${base}?${params.toString()}`;
};

const InfluencerHeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  ({ affiliateProfileId, video }, ref) => {

    const embedUrl = useMemo(() => {
      if (!video?.videoUrl) {
        // Fallback video nếu chưa có video nào được chọn
        return sanitizeEmbedUrl('https://www.youtube.com/embed/UY0Og8583jA?autoplay=1&rel=0');
      }
      return sanitizeEmbedUrl(video.videoUrl);
    }, [video]);

    return (
      <section
        ref={ref}
        className="relative w-full overflow-hidden py-24"
        style={{
          backgroundImage: `url(${ReviewBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h1
              className="mx-auto text-4xl md:text-5xl font-bold leading-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                background:
                  'linear-gradient(270deg,#511BEA 17.27%,#AC3258 34.26%,#FF850B 54.35%,#C628A3 71.73%,#9425D9 91.43%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Mua Sắm Thông Minh
              <br />
              Xem Review, Chọn Sản Phẩm Phù Hợp
            </h1>
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5 group">
              <div className="aspect-video w-full bg-black">
                <iframe
                  key={video?.videoId || 'fallback'}
                  src={embedUrl}
                  title={video?.title || 'Video review'}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Info / Meta */}
              <div className="p-6 bg-white/85 backdrop-blur-md transition-opacity">
                {video ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                      {video.title}
                    </h2>
                    {video.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                        {video.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>
                        {new Date(video.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          video.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {video.isActive ? 'Hoạt động' : 'Ngưng'}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-600">
                    Chọn một video ở bên dưới để xem ngay.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Gradient overlay subtle */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent" />
      </section>
    );
  }
);

InfluencerHeroSection.displayName = 'HeroSection';
export default InfluencerHeroSection;
