import { SoundCloudEmbed, VideoFrame, YouTubeEmbed, YouTubeExternalCard } from '../MediaPlayers';
import { ProjectCard } from '../PortfolioCards';
import { getVideoProvider } from '../../utils/video';

function ExternalWatchLink({ url, accentColor }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-[44px] items-center justify-center rounded-full px-3 py-1 text-xs sm:mt-2 sm:min-h-0 sm:text-sm mt-2 mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        color: accentColor,
        border: `1px solid ${accentColor}80`,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        '--tw-ring-color': accentColor,
        '--tw-ring-offset-color': '#0A0A0F'
      }}
    >
      {getVideoProvider(url) === 'dailymotion' ? 'Watch on Dailymotion' : 'Watch on YouTube'}
    </a>
  );
}

function SectionLabel({ children, className }) {
  return <h3 className={className} style={{ color: '#ccc' }}>{children}</h3>;
}

function GameAudioSection({ data, section, classes }) {
  const { sectionLabel, title, role, description, meta, emoji } = classes;
  return (
    <>
      <div className="mb-10 sm:mb-12">
        <SectionLabel className={sectionLabel}>Commercial Projects</SectionLabel>
        <div className="grid gap-4 sm:gap-5">
          {data.commercial.map((project) => (
            <ProjectCard key={project.youtubeUrl ?? project.title} className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className={emoji} aria-hidden="true">{project.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h4 className={title}>{project.type} - {project.title}</h4>
                    {project.award && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#FF6B00', color: '#000' }}>
                        🏆 {project.award}
                      </span>
                    )}
                  </div>
                  <p className={role} style={{ color: section.color }}>{project.role}</p>
                  <p className={description} style={{ color: '#B8BBC2' }}>{project.description}</p>
                  <p className={`${meta} mt-3`} style={{ color: '#7f858e' }}>
                    {project.client.startsWith('The ') ? project.client : `Client: ${project.client}`}
                  </p>
                </div>
              </div>
              {project.youtubeUrl && (
                <>
                  <VideoFrame url={project.youtubeUrl} title={`${project.type} - ${project.title} video`} accentColor={section.color} />
                  <ExternalWatchLink url={project.youtubeUrl} accentColor={section.color} />
                </>
              )}
            </ProjectCard>
          ))}
        </div>
      </div>

      <div className="mb-10 sm:mb-12">
        <SectionLabel className={sectionLabel}>Personal Projects</SectionLabel>
        <div className="grid gap-4 sm:gap-5">
          {data.personal.map((project) => (
            <ProjectCard key={project.youtubeUrl ?? project.title} className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className={emoji} aria-hidden="true">{project.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h4 className={`${title} mb-1`}>{project.title}</h4>
                  <p className={role} style={{ color: section.color }}>{project.role}</p>
                  <p className={description} style={{ color: '#B8BBC2' }}>{project.description}</p>
                </div>
              </div>
              {project.youtubeUrl && (
                <>
                  <VideoFrame url={project.youtubeUrl} title={`${project.title} video`} accentColor={section.color} />
                  <ExternalWatchLink url={project.youtubeUrl} accentColor={section.color} />
                </>
              )}
            </ProjectCard>
          ))}
        </div>
      </div>
    </>
  );
}

function MusicSection({ data, section }) {
  return (
    <>
      <div className="space-y-8 sm:space-y-10 mb-12 sm:mb-16">
        {data.playlists.map((playlist, index) => (
          <div key={playlist.soundcloudUrl} className="pb-6 sm:pb-8 border-b border-[#1a1a24] last:border-b-0 last:pb-0">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">{playlist.emoji}</span>
              <h3 className="text-lg sm:text-2xl font-semibold text-white tracking-tight">{playlist.title}</h3>
            </div>
            <SoundCloudEmbed url={playlist.soundcloudUrl} title={playlist.title} height={320} featured={index === 0} compact={false} accentColor={section.color} />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
        <div className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24', boxShadow: `0 10px 24px rgba(0,0,0,0.25), 0 0 0 1px ${section.color}70` }}>
          <h3 className="text-xs sm:text-base font-semibold mb-4 tracking-wide" style={{ color: section.color }}>Genres</h3>
          <div className="flex flex-wrap gap-2">
            {data.info.genres.map((genre) => <span key={genre} className="px-3 py-1 rounded-full text-xs sm:text-sm" style={{ backgroundColor: '#1a1a24', color: '#ccc' }}>{genre}</span>)}
          </div>
        </div>
        <div className="p-5 sm:p-6 rounded-2xl" style={{ backgroundColor: '#14161c', border: '1px solid #1a1a24', boxShadow: `0 10px 24px rgba(0,0,0,0.25), 0 0 0 1px ${section.color}70` }}>
          <h3 className="text-xs sm:text-base font-semibold mb-4 tracking-wide" style={{ color: section.color }}>Tools</h3>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#ccc' }}>{data.info.tools.join(', ')}</p>
        </div>
      </div>
    </>
  );
}

function MixingSection({ data, section, classes }) {
  return (
    <div className="mb-10 sm:mb-12">
      <SectionLabel className={classes.sectionLabel}>Commercial Projects</SectionLabel>
      <div className="space-y-6 sm:space-y-8">
        {data.projects.map((project, index) => (
          <ProjectCard key={project.youtubeId ?? project.title} className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <span className={classes.emoji} aria-hidden="true">{project.emoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`${classes.title} mb-1`}>{project.title}</h4>
                <p className={classes.role} style={{ color: section.color }}>{project.role}</p>
                <p className={classes.description} style={{ color: '#B8BBC2' }}>{project.description}</p>
              </div>
            </div>
            {project.youtubeId && (project.externalOnly
              ? <YouTubeExternalCard videoId={project.youtubeId} title={project.title} accentColor={section.color} />
              : <YouTubeEmbed videoId={project.youtubeId} title={project.title} featured={index === 0} accentColor={section.color} />)}
          </ProjectCard>
        ))}
      </div>
    </div>
  );
}

function VocalSection({ data, section, classes }) {
  return (
    <div className="mb-10 sm:mb-12">
      <SectionLabel className={classes.sectionLabel}>Commercial Projects</SectionLabel>
      <div className="space-y-5 sm:space-y-6">
        {data.projects.map((project, index) => (
          <ProjectCard key={project.youtubeId ?? project.soundcloudUrl ?? project.title} className="p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <span className={classes.emoji} aria-hidden="true">{project.emoji}</span>
              <div className="flex-1 min-w-0">
                <h4 className={`${classes.title} mb-1`}>{project.title}</h4>
                <p className={classes.role} style={{ color: section.color }}>{project.role}</p>
                {project.client && <p className={`${classes.meta} mb-3`} style={{ color: '#7f858e' }}>{project.client.startsWith('The ') ? project.client : `Client: ${project.client}`}</p>}
                {project.description && <p className={`${classes.description} mb-3`} style={{ color: '#B8BBC2' }}>{project.description}</p>}
                {project.responsibilities && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.responsibilities.map((responsibility) => <span key={responsibility} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#1a1a24', color: '#9aa0a6' }}>{responsibility}</span>)}
                  </div>
                )}
              </div>
            </div>
            {project.soundcloudUrl && <SoundCloudEmbed url={project.soundcloudUrl} title={project.title} height={200} featured={index === 0} accentColor={section.color} />}
            {project.youtubeId && <YouTubeEmbed videoId={project.youtubeId} title={project.title} featured={index === 0} accentColor={section.color} />}
          </ProjectCard>
        ))}
      </div>
    </div>
  );
}

function MediaProjectList({ projects, section, classes }) {
  return (
    <div className="space-y-5 sm:space-y-6">
      {projects.map((project, index) => (
        <ProjectCard key={project.youtubeId ?? project.title} className="p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <span className={classes.emoji} aria-hidden="true">{project.emoji}</span>
            <div className="flex-1 min-w-0">
              <h4 className={`${classes.title} mb-1`}>{project.title}</h4>
              <p className={classes.role} style={{ color: section.color }}>{project.role}</p>
              <p className={`${classes.description} ${project.client ? 'mb-3' : ''}`} style={{ color: '#B8BBC2' }}>{project.description}</p>
              {project.client && <p className={classes.meta} style={{ color: '#7f858e' }}>{project.client.startsWith('The ') ? project.client : `Client: ${project.client}`}</p>}
            </div>
          </div>
          {project.youtubeId && <YouTubeEmbed videoId={project.youtubeId} title={project.title} featured={index === 0} accentColor={section.color} />}
        </ProjectCard>
      ))}
    </div>
  );
}

function VisualMediaSection({ data, section, classes }) {
  return (
    <>
      <div className="mb-10 sm:mb-12">
        <SectionLabel className={classes.sectionLabel}>Commercial Projects</SectionLabel>
        <MediaProjectList projects={data.commercial} section={section} classes={classes} />
      </div>
      <div className="mb-10 sm:mb-12">
        <SectionLabel className={classes.sectionLabel}>Personal Projects</SectionLabel>
        <MediaProjectList projects={data.personal} section={section} classes={classes} />
      </div>
    </>
  );
}

const sectionComponents = {
  game: GameAudioSection,
  music: MusicSection,
  mixing: MixingSection,
  vocal: VocalSection,
  media: VisualMediaSection
};

export default function PortfolioSectionBody({ activeSection, data, section, classes }) {
  const SectionComponent = sectionComponents[activeSection];
  return SectionComponent ? <SectionComponent data={data} section={section} classes={classes} /> : null;
}
