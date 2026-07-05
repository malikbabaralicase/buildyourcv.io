import React from 'react';
import { resolveAssetUrl } from '../../services/api';

const SectionTitle = ({ children }) => (
    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em] border-b-2 border-slate-800 pb-1 mb-4">
        {children}
    </h2>
);

const ClassicTemplate = ({ profileData }) => {
    const { user, profile, education, experience, skills, projects, certifications, languages } = profileData;

    const contactLine = [
        user?.email,
        user?.phone,
        profile?.address,
        profile?.linkedin,
        profile?.github,
        profile?.website,
    ].filter(Boolean).join('   |   ');

    return (
        <div className="bg-white p-12 h-full w-full box-border font-serif text-slate-800">
            {/* Header */}
            <header className="text-center mb-8">
                {profile?.image && (
                    <img
                        src={resolveAssetUrl(profile.image)}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border border-slate-300"
                    />
                )}
                <h1 className="text-4xl font-bold tracking-wide text-slate-900">{user?.name}</h1>
                {profile?.headline && <div className="text-base italic text-slate-600 mt-2">{profile.headline}</div>}
                {contactLine && <div className="text-xs text-slate-500 mt-3">{contactLine}</div>}
                <div className="w-24 h-[2px] bg-slate-800 mx-auto mt-5" />
            </header>

            {profile?.summary && (
                <section className="mb-7">
                    <SectionTitle>Profile</SectionTitle>
                    <p className="text-sm leading-relaxed">{profile.summary}</p>
                </section>
            )}

            {experience && experience.length > 0 && (
                <section className="mb-7">
                    <SectionTitle>Experience</SectionTitle>
                    <div className="flex flex-col gap-4">
                        {experience.map(exp => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-base">{exp.title}</h3>
                                    <span className="text-xs text-slate-500">{exp.duration}</span>
                                </div>
                                <div className="text-sm italic text-slate-600">{exp.company}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {education && education.length > 0 && (
                <section className="mb-7">
                    <SectionTitle>Education</SectionTitle>
                    <div className="flex flex-col gap-3">
                        {education.map(edu => (
                            <div key={edu.id} className="flex justify-between items-baseline">
                                <div>
                                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                                    <div className="text-sm text-slate-600">{edu.institute}</div>
                                </div>
                                <span className="text-xs text-slate-500">{edu.year}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {projects && projects.length > 0 && (
                <section className="mb-7">
                    <SectionTitle>Projects</SectionTitle>
                    <div className="flex flex-col gap-4">
                        {projects.map(p => (
                            <div key={p.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold text-sm">{p.title}</h3>
                                    {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-xs underline">{p.link}</a>}
                                </div>
                                {p.tech_stack && <div className="text-xs italic text-slate-500 mb-1">{p.tech_stack}</div>}
                                <p className="text-sm leading-relaxed">{p.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {skills && skills.length > 0 && (
                <section className="mb-7">
                    <SectionTitle>Skills</SectionTitle>
                    <p className="text-sm leading-relaxed">
                        {skills.map(s => s.skill_name).join('  •  ')}
                    </p>
                </section>
            )}

            <div className="grid grid-cols-2 gap-8">
                {certifications && certifications.length > 0 && (
                    <section>
                        <SectionTitle>Certifications</SectionTitle>
                        <ul className="flex flex-col gap-2 text-sm">
                            {certifications.map(c => (
                                <li key={c.id}>
                                    <span className="font-bold">{c.name}</span>{c.issuer ? ` — ${c.issuer}` : ''}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {languages && languages.length > 0 && (
                    <section>
                        <SectionTitle>Languages</SectionTitle>
                        <ul className="flex flex-col gap-2 text-sm">
                            {languages.map(l => (
                                <li key={l.id}>{l.language} <span className="italic text-slate-500">({l.proficiency})</span></li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ClassicTemplate;
