import { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my portfolio of web development projects built with modern technologies.',
};

export default function ProjectsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A collection of projects I&apos;ve built, ranging from full-stack
            applications to frontend experiments. Each project represents a
            unique challenge and learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
