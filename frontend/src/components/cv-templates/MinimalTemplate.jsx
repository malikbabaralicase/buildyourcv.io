import React from 'react';
import { Mail, Phone, MapPin, Link2, Code2, Globe } from 'lucide-react';
import { resolveAssetUrl } from '../../services/api';

const Heading = ({ children }) => (
    <h2 className="text-xs font-bold text-teal-700 uppercase tracking-[0.25em] mb-4">{children}</h2>
);

const MinimalTemplate = ({ profileData }) => {
    const { user, profile, education, experience, skills, projects, certifications, languages } = profileData;

    return (
        <div className="bg-white h-full w-full box-border font-sans text-slate-700 flex">
            {/* Sidebar */}
            <aside className="w-[34%] bg-slate-50 p-8 flex flex-col gap-8 border-r border-slate-100">
                {profile?.image && (
                    <img
                        src={resolveAssetUrl(profile.image)}
                        alt="Profile"
                        className="w-28 h-28 rounded-full object-cover mx-auto"
                    />
                )}

                <div>
                    <Heading>Contact</Heading>
                    <div className="flex flex-col gap-2 text-xs">
                        {user?.email && <span className="flex items-center gap-2"><Mail size={13}/> {user.email}</span>}
                        {user?.phone && <span className="flex items-center gap-2"><Phone size={13}/> {user.phone}</span>}
                        {profile?.address && <span className="flex items-center gap-2"><MapPin size={13}/> {profile.address}</span>}
                        {profile?.linkedin && <span className="flex items-center gap-2"><Link2 size={13}/> {profile.linkedin}</span>}
                        {profile?.github && <span className="flex items-center gap-2"><Code2 size={13}/> {profile.github}</span>}
                        {profile?.website && <span className="flex items-center gap-2"><Globe size={13}/> {profile.website}</span>}
                    </div>
                </div>

                {skills && skills.length > 0 && (
                    <div>
                        <Heading>Skills</Heading>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(s => (
                                <span key={s.id} className="text-[10px] font-semibold bg-teal-50 text-teal-800 px-2 py-1 rounded">{s.skill_name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {languages && languages.length > 0 && (
                    <div>
                        <Heading>Languages</Heading>
                        <div className="flex flex-col gap-2 text-xs">
                            {languages.map(l => (
                                <div key={l.id} className="flex justify-between">
                                    <span>{l.language}</span>
                                    <span className="text-slate-400">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {certifications && certifications.length > 0 && (
                    <div>
                        <Heading>Certifications</Heading>
                        <div className="flex flex-col gap-2 text-xs">
                            {certifications.map(c => (
                                <div key={c.id}>
                                    <div className="font-semibold">{c.name}</div>
                                    <div className="text-slate-400">{c.issuer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main className="flex-1 p-10 flex flex-col gap-8">
                <header>
                    <h1 className="text-3xl font-light tracking-tight text-slate-900">{user?.name}</h1>
                    {profile?.headline && <div className="text-sm text-teal-700 font-medium mt-1">{profile.headline}</div>}
                </header>

                {profile?.summary && (
                    <section>
                        <Heading>About</Heading>
                        <p className="text-sm leading-relaxed text-slate-600">{profile.summary}</p>
                    </section>
                )}

                {experience && experience.length > 0 && (
                    <section>
                        <Heading>Experience</Heading>
                        <div className="flex flex-col gap-5">
                            {experience.map(exp => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-sm text-slate-900">{exp.title}</h3>
                                        <span className="text-[11px] text-slate-400">{exp.duration}</span>
                                    </div>
                                    <div className="text-xs text-slate-500">{exp.company}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects && projects.length > 0 && (
                    <section>
                        <Heading>Projects</Heading>
                        <div className="flex flex-col gap-5">
                            {projects.map(p => (
                                <div key={p.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-sm text-slate-900">{p.title}</h3>
                                        {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-[11px] text-teal-700 underline">Link</a>}
                                    </div>
                                    {p.tech_stack && <div className="text-[11px] text-teal-700 mb-1">{p.tech_stack}</div>}
                                    <p className="text-xs leading-relaxed text-slate-600">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education && education.length > 0 && (
                    <section>
                        <Heading>Education</Heading>
                        <div className="flex flex-col gap-3">
                            {education.map(edu => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-semibold text-sm text-slate-900">{edu.degree}</h3>
                                        <div className="text-xs text-slate-500">{edu.institute}</div>
                                    </div>
                                    <span className="text-[11px] text-slate-400">{edu.year}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default MinimalTemplate;
