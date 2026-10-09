import s from "@/app/editorial.module.css";

const skills = [
  { number: "01", name: "Interfaces", description: "Thoughtful foundations for the things you see and use.", tags: ["React & Next.js", "TypeScript", "Responsive CSS"], mark: "UI" },
  { number: "02", name: "Interactions", description: "A little motion that makes an interface feel alive.", tags: ["Three.js", "Scroll storytelling", "Accessible interactions"], mark: "IX" },
  { number: "03", name: "Curiosity", description: "The habits behind the work. Always a work in progress.", tags: ["Visual exploration", "Learning by making", "Care for the details"], mark: "∞" },
];

/** Reused as the opening scroll presentation and the desktop toolkit contents. */
export default function FocusPresentation() {
  return <div className={s.focusPresentation}>
    <div className={s.focusWash} aria-hidden="true" />
    <h3 className={s.focusStatement} data-focus-statement><span>I keep my<br/>focus on</span><em>important things.</em></h3>
    <div className={s.focusLabel}><span>My toolkit</span></div>
    <div className={s.focusCards}>
      {skills.map(skill => <article className={s.focusCard} data-focus-card key={skill.number} aria-label={skill.name}>
        <div className={s.focusCardFront}>
          <div className={s.focusCardContent}><h4>{skill.name}</h4><p>{skill.description}</p><ul>{skill.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
          <div className={s.focusCardStub}><span>YNZ / FIELD {skill.number}</span><b>{skill.mark}</b><div className={s.barcode} aria-hidden="true"/><small>BUILT WITH CARE. ALWAYS IN PROGRESS.</small></div>
        </div>
        <div className={s.focusCardBack} aria-hidden="true"><div className={s.backMarks}><span>▦</span><span>⌖</span></div><span>YNZ / FIELD {skill.number}</span><strong>{skill.mark}</strong><div className={s.backTear}>CUT ALONG LINE <span>➜ ➜ ➜</span></div><small>A LITTLE CODE. A LOT OF CARE.</small></div>
      </article>)}
    </div>
    <p className={s.focusFootnote}><em>Care is in the details.</em><br/>The interface you see. The interactions you feel.<br/>The engineering holding it all together.</p>
  </div>;
}
