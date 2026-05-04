import Link from 'next/link'
import PublicHeader from './components/PublicHeader'
import PublicFooter from './components/PublicFooter'
import PinnedAnnouncementSlider from './components/PinnedAnnouncementSlider'
import { createClient } from '../lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: meetings } = await supabase
    .from('meetings')
    .select('title, platform, meeting_url, description, meeting_date, meeting_time')
    .order('meeting_date', { ascending: true })
    .limit(3)

  const { data: pinnedAnnouncements } = await supabase
    .from('app_announcements')
    .select('id, title, content, image_url, video_url, created_at')
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <main className='min-h-screen bg-[#140603] pb-20 text-[#fff8ed] md:pb-0'>
      <PublicHeader />

      <section className='relative overflow-hidden border-b border-orange-500/30 bg-[radial-gradient(circle_at_top_left,#7f1d1d_0%,#2b0906_34%,#100403_72%,#050202_100%)] px-4 py-10 md:px-8 md:py-16'>
        <div className='absolute inset-0 opacity-50'>
          <div className='absolute -right-16 top-10 h-96 w-96 rounded-full bg-orange-500 blur-[130px]' />
          <div className='absolute bottom-0 left-4 h-80 w-80 rounded-full bg-red-600 blur-[140px]' />
          <div className='absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300 blur-[160px]' />
        </div>

        <div className='relative mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center'>
          <div>
            <div className='inline-flex rounded-full border border-orange-300/40 bg-orange-950/50 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-orange-100 shadow-lg shadow-orange-950/40 md:text-sm'>
              Prayer • Deliverance • Worship • The Word
            </div>

            <h1 className='mt-6 max-w-3xl text-6xl font-black leading-[0.95] tracking-tight text-[#fff3dc] md:text-8xl'>
              Divine Family
            </h1>

            <p className='mt-6 max-w-2xl text-base leading-8 text-orange-50/90 md:text-lg'>
              A family under Divine Power Deliverance Ministry, growing in prayer,
              deliverance, worship, and the Word of God.
            </p>

            <div className='mt-8 flex flex-wrap gap-4'>
              <Link
                href='/public/posts'
                className='rounded-full bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 px-7 py-3 text-sm font-black text-[#2b0804] shadow-xl shadow-orange-950/40 transition hover:scale-[1.02]'
              >
                Explore Ministry Updates
              </Link>

              <Link
                href='/public/meetings'
                className='rounded-full border border-orange-200/40 bg-white/10 px-7 py-3 text-sm font-bold text-orange-50 backdrop-blur hover:bg-white/15'
              >
                Join Meetings
              </Link>
            </div>

            <div className='mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3'>
              {meetings && meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <div
                    key={`${meeting.title}-${meeting.meeting_date}-${meeting.meeting_time}`}
                    className='rounded-[1.4rem] border border-orange-300/20 bg-[#fff7e8] p-5 text-[#3a0b05] shadow-xl shadow-red-950/30'
                  >
                    <p className='text-sm font-black uppercase tracking-[0.15em] text-orange-700'>
                      {meeting.meeting_date || 'Scheduled'}
                    </p>

                    <h3 className='mt-2 text-lg font-black'>
                      {meeting.title}
                    </h3>

                    <p className='text-sm text-[#7c2d12]'>
                      {meeting.meeting_time || 'Time to be announced'}
                    </p>
                  </div>
                ))
              ) : (
                <>
                  <div className='rounded-[1.4rem] border border-orange-300/20 bg-[#fff7e8] p-5 text-[#3a0b05] shadow-xl shadow-red-950/30'>
                    <p className='text-sm font-black uppercase tracking-[0.15em] text-orange-700'>Thursday</p>
                    <h3 className='mt-2 text-lg font-black'>Bible Study</h3>
                    <p className='text-sm text-[#7c2d12]'>8:00 PM</p>
                  </div>

                  <div className='rounded-[1.4rem] border border-orange-300/20 bg-[#fff7e8] p-5 text-[#3a0b05] shadow-xl shadow-red-950/30'>
                    <p className='text-sm font-black uppercase tracking-[0.15em] text-orange-700'>Sunday</p>
                    <h3 className='mt-2 text-lg font-black'>Service</h3>
                    <p className='text-sm text-[#7c2d12]'>7:00 PM</p>
                  </div>

                  <div className='rounded-[1.4rem] border border-orange-300/20 bg-[#fff7e8] p-5 text-[#3a0b05] shadow-xl shadow-red-950/30'>
                    <p className='text-sm font-black uppercase tracking-[0.15em] text-orange-700'>Daily</p>
                    <h3 className='mt-2 text-lg font-black'>Personal Bible Study</h3>
                    <p className='text-sm text-[#7c2d12]'>Individual study possible</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className='rounded-[2.4rem] bg-gradient-to-br from-[#fff7e8] via-[#ffe2b8] to-[#fb923c] p-4 text-[#2b0804] shadow-2xl shadow-orange-950/50'>
            <div className='rounded-[2rem] border border-orange-200/30 bg-[#2b0804] p-5 text-[#fff7e8]'>
              <div className='flex items-center gap-4'>
                <img
                  src='/dpdm-logo.png'
                  alt='Divine Power Deliverance Ministry'
                  className='h-16 w-16 rounded-full border border-orange-200/40 object-cover shadow-lg shadow-black/40'
                />

                <div>
                  <p className='text-xs uppercase tracking-[0.3em] text-orange-200'>
                    Divine Power Deliverance Ministry
                  </p>

                  <h2 className='mt-1 text-2xl font-black'>
                    {pinnedAnnouncements && pinnedAnnouncements.length > 0
                      ? 'Pinned Notice'
                      : 'Today'}
                  </h2>
                </div>
              </div>

              {pinnedAnnouncements && pinnedAnnouncements.length > 0 ? (
                <PinnedAnnouncementSlider
                  announcements={pinnedAnnouncements}
                  intervalMs={15000}
                />
              ) : (
                <>
                  <div className='mt-6 rounded-[1.4rem] bg-gradient-to-r from-red-700 via-orange-600 to-amber-400 p-5 text-white shadow-lg shadow-red-950/40'>
                    <p className='text-xs uppercase tracking-[0.25em] text-orange-100'>
                      Welcome
                    </p>
                    <p className='mt-3 text-lg font-black'>
                      Growing together in prayer, deliverance, worship, and the Word.
                    </p>
                  </div>

                  <div className='mt-5 grid grid-cols-2 gap-4'>
                    <div className='rounded-[1.2rem] bg-[#fff7e8] p-4 text-[#3a0b05]'>
                      <p className='text-xs font-bold uppercase tracking-[0.15em] text-orange-700'>Schedule</p>
                      <p className='mt-2 font-black'>
                        {meetings?.[0]?.title || 'Thursday'}
                      </p>
                      <p className='text-sm'>
                        {meetings?.[0]?.meeting_time || 'Bible Study · 8:00 PM'}
                      </p>
                    </div>

                    <div className='rounded-[1.2rem] bg-[#fff7e8] p-4 text-[#3a0b05]'>
                      <p className='text-xs font-bold uppercase tracking-[0.15em] text-orange-700'>Prayer</p>
                      <p className='mt-2 font-black'>Stand Together</p>
                      <p className='text-sm'>Prayer Wall</p>
                    </div>
                  </div>

                  <div className='mt-5 rounded-[1.2rem] border border-orange-300/30 bg-black/30 p-4'>
                    <p className='text-xs uppercase tracking-[0.25em] text-orange-200'>
                      Meditation Scripture
                    </p>
                    <p className='mt-3 text-sm leading-6 text-orange-50/90'>
                      “He humbled you, caused you to hunger, and fed you with manna...”
                    </p>
                    <p className='mt-2 text-xs text-orange-200/60'>Deuteronomy 8:3</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 py-10 md:px-8'>
        <div className='mb-6'>
          <p className='text-xs uppercase tracking-[0.35em] text-orange-300'>
            Ministry Life
          </p>
          <h2 className='mt-2 text-3xl font-black text-[#fff3dc] md:text-4xl'>
            Enter the Divine Family platform
          </h2>
          <p className='mt-3 max-w-3xl text-sm leading-7 text-orange-50/80'>
            Access teachings, books, meetings, prayer, giving, and member tools.
          </p>
        </div>

        <div className='grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
          <Link href='/public/posts' className='rounded-[1.6rem] border border-orange-400/20 bg-gradient-to-br from-[#3a0b05] via-[#1f0704] to-black p-6 shadow-lg shadow-black/30 hover:border-orange-300/60'>
            <p className='text-xs uppercase tracking-[0.25em] text-orange-300'>Teaching</p>
            <h3 className='mt-3 text-2xl font-black'>Posts</h3>
            <p className='mt-3 text-sm leading-6 text-orange-50/75'>Read teaching posts, meditations, and community writings.</p>
          </Link>

          <Link href='/public/books' className='rounded-[1.6rem] border border-orange-400/20 bg-gradient-to-br from-[#3a0b05] via-[#1f0704] to-black p-6 shadow-lg shadow-black/30 hover:border-orange-300/60'>
            <p className='text-xs uppercase tracking-[0.25em] text-orange-300'>Resources</p>
            <h3 className='mt-3 text-2xl font-black'>Books</h3>
            <p className='mt-3 text-sm leading-6 text-orange-50/75'>Explore Divine Family books and teaching resources.</p>
          </Link>

          <Link href='/public/connect' className='rounded-[1.6rem] border border-orange-400/20 bg-gradient-to-br from-[#3a0b05] via-[#1f0704] to-black p-6 shadow-lg shadow-black/30 hover:border-orange-300/60'>
            <p className='text-xs uppercase tracking-[0.25em] text-orange-300'>Channels</p>
            <h3 className='mt-3 text-2xl font-black'>Connect</h3>
            <p className='mt-3 text-sm leading-6 text-orange-50/75'>Visit official media channels and public links.</p>
          </Link>

          <Link href='/public/meetings' className='rounded-[1.6rem] border border-orange-400/20 bg-gradient-to-br from-[#3a0b05] via-[#1f0704] to-black p-6 shadow-lg shadow-black/30 hover:border-orange-300/60'>
            <p className='text-xs uppercase tracking-[0.25em] text-orange-300'>Gatherings</p>
            <h3 className='mt-3 text-2xl font-black'>Meetings</h3>
            <p className='mt-3 text-sm leading-6 text-orange-50/75'>Join services, Bible studies, and live fellowship meetings.</p>
          </Link>

          <Link href='/public/giving' className='rounded-[1.6rem] border border-orange-400/20 bg-gradient-to-br from-[#3a0b05] via-[#1f0704] to-black p-6 shadow-lg shadow-black/30 hover:border-orange-300/60'>
            <p className='text-xs uppercase tracking-[0.25em] text-orange-300'>Giving</p>
            <h3 className='mt-3 text-2xl font-black'>Eternal Wealth</h3>
            <p className='mt-3 text-sm leading-6 text-orange-50/75'>
              Make for yourselves eternal wealth with unrighteous mammon, and store your treasure where decay cannot destroy.
            </p>
          </Link>

          <Link href='/login' className='rounded-[1.6rem] border border-orange-400/20 bg-gradient-to-br from-[#3a0b05] via-[#1f0704] to-black p-6 shadow-lg shadow-black/30 hover:border-orange-300/60'>
            <p className='text-xs uppercase tracking-[0.25em] text-orange-300'>Member Access</p>
            <h3 className='mt-3 text-2xl font-black'>Login</h3>
            <p className='mt-3 text-sm leading-6 text-orange-50/75'>Enter the member dashboard and community tools.</p>
          </Link>
        </div>
      </section>

      <section className='mx-auto max-w-6xl px-4 pb-12 md:px-8'>
        <div className='rounded-[2rem] border border-orange-400/20 bg-gradient-to-br from-[#fff7e8] to-[#fed7aa] p-6 text-[#3a0b05] shadow-xl shadow-black/30 md:p-8'>
          <p className='text-xs font-black uppercase tracking-[0.35em] text-orange-700'>
            Identity
          </p>

          <h2 className='mt-3 text-3xl font-black'>
            A family of prayer, deliverance, worship, and the Word.
          </h2>

          <p className='mt-4 max-w-3xl text-sm leading-7 text-[#7c2d12] md:text-base'>
            Divine Power Deliverance Ministry exists as a Christ-centered community for teaching,
            prayer, deliverance, formation, and worship. We grow together under the Word,
            in fellowship, and in the life of Christ.
          </p>
        </div>
      </section>

      <PublicFooter />
    </main>
  )
}
