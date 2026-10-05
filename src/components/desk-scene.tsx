export default function DeskScene() {
  return (
    <svg className="desk-drawing" viewBox="0 0 1000 800" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="desk-title">
      <title id="desk-title">A woman software engineer at her laptop, surrounded by a plant, coffee, notebooks and ideas.</title>
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(25)"><path d="M0 0V8" stroke="currentColor" strokeWidth="1" opacity=".25"/></pattern>
        <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" opacity=".3"/></pattern>
      </defs>
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <g className="room-layer" opacity=".45">
          <path d="M138 452V111L477 47V358M143 114L474 52M157 431V132L457 75V363M302 104V395M156 274L456 217"/>
          <path d="M177 221Q212 163 248 205Q269 146 298 177M326 183Q356 131 383 161Q416 105 448 134" strokeDasharray="3 6"/>
          <path d="M548 117L692 139V274L548 251Z"/><path d="M563 134L677 152V255L563 237Z"/>
          <circle cx="618" cy="189" r="26"/><path d="M597 210L640 168M592 190H646M618 163V215"/>
          <path d="M83 574L518 733L942 515M94 601L518 758L931 545" strokeDasharray="2 8"/>
        </g>
        <g className="chair-layer">
          <path d="M585 456Q636 411 694 433L691 564Q653 602 590 575Z" fill="var(--paper)"/>
          <path d="M598 467Q641 438 679 446L677 551Q642 580 603 565Z" fill="url(#hatch)"/>
          <path d="M608 565L553 605Q552 623 583 631L664 605Q687 594 687 567" fill="var(--paper)"/>
          <path d="M619 621V680M578 700L619 680L671 698M619 680L619 711" strokeWidth="6"/>
          <ellipse cx="577" cy="704" rx="8" ry="5" fill="currentColor"/><ellipse cx="674" cy="702" rx="8" ry="5" fill="currentColor"/><ellipse cx="619" cy="715" rx="8" ry="5" fill="currentColor"/>
        </g>
        <g className="person-layer">
          <path d="M528 532Q504 557 486 610L489 664L512 669L527 618L568 574M567 551Q594 579 573 620L547 678L526 670L542 607L516 588" fill="var(--blue-light)"/>
          <path d="M488 655L509 661L510 684Q475 699 459 688Q456 676 488 655ZM529 664L549 674L544 692Q509 704 500 694Q496 681 529 664Z" fill="var(--paper)"/>
        </g>
        <g className="table-layer">
          <path d="M178 412L531 339L828 454L468 566Z" fill="var(--paper)"/>
          <path d="M178 412V429L468 586L828 473V454L468 566Z" fill="var(--blue-light)"/>
          <path d="M197 440L214 639L229 645L236 461M783 487L769 657L784 651L804 480M455 584L447 742L464 750L485 580" fill="var(--paper)"/>
          <path d="M210 459L223 627M467 594L458 732M794 494L778 642" opacity=".5"/>
        </g>
        <g className="upper-body-layer">
          <path d="M548 342Q576 322 605 343Q632 370 625 420L603 479L600 548Q570 581 514 551L520 455L515 391Z" fill="var(--paper)"/>
          <path d="M528 389L522 442M536 476L530 535M547 493L543 545M559 498L558 551M576 495L574 548M590 484L590 540" opacity=".4"/>
          <path d="M559 317L555 344Q574 365 589 341L585 309" fill="var(--paper)"/>
          <path d="M539 258Q572 232 599 267L593 316Q578 340 557 323L542 303Z" fill="var(--paper)"/>
          <path d="M541 287Q525 297 530 323Q510 317 516 290Q491 268 517 241Q529 214 563 222Q605 214 614 249Q637 266 619 291Q635 318 617 339L595 341L590 296Q582 281 586 255Q564 280 540 276Z" fill="currentColor"/>
          <path d="M527 250Q536 232 556 234M603 250Q618 271 605 284M605 300Q618 321 606 328" stroke="var(--paper)" opacity=".6"/>
          <path d="M541 290L548 290M543 299L539 307L547 309M552 317L561 314"/>
          <path d="M531 371Q516 359 507 380L486 432L438 424L433 441Q471 465 500 455L533 408" fill="var(--paper)"/>
          <path d="M606 373Q588 364 580 386L563 429L501 451L506 467Q560 469 581 454Q598 431 611 401" fill="var(--paper)"/>
          <path d="M440 424L423 416L409 418L414 426L436 439M503 451L481 447L468 453L485 463L507 466" fill="var(--paper)"/>
        </g>
        <g className="notebook-layer">
          <path d="M619 447L696 425L756 449L680 475Z" fill="var(--blue-light)"/><path d="M620 447V454L680 482L755 456V449M680 475V482"/>
          <path d="M630 438L698 417L747 440L679 463Z" fill="var(--paper)"/>
          <path d="M643 439L695 423M650 444L702 428M657 449L688 439M636 434L641 437M646 431L651 434M657 428L662 431M668 425L673 428"/>
          <path d="M710 482L752 467L757 470L715 486Z" fill="currentColor"/>
        </g>
        <g className="laptop-layer">
          <path d="M332 416L457 385L553 441L429 481Z" fill="var(--blue-light)"/>
          <path d="M332 416L303 310Q302 303 310 304L428 334Q436 336 438 344L457 436L429 481Z" fill="var(--paper)"/>
          <path d="M315 319L422 345L442 428L337 401Z" fill="var(--ink)"/>
          <path d="M332 338L360 345M336 350L384 362M340 362L370 370M344 374L394 387M348 386L370 392" stroke="var(--paper)" strokeWidth="3" opacity=".7"/>
          <path d="M391 366L384 371L395 379M405 370L414 381L408 385" stroke="#b5b9ff" strokeWidth="2.5"/>
          <path d="M448 421L487 409L529 436L475 453M458 426L492 416M466 432L500 422M474 438L508 428M429 481V488L553 447V441"/>
          <path d="M331 413L428 439" opacity=".3"/>
        </g>
        <g className="coffee-layer">
          <path d="M263 413L268 447Q286 460 303 447L308 413" fill="var(--paper)"/>
          <ellipse cx="285" cy="413" rx="23" ry="9" fill="var(--paper)"/>
          <ellipse cx="285" cy="414" rx="17" ry="5" fill="currentColor"/>
          <path d="M308 421Q332 416 323 437Q319 444 307 439" strokeWidth="3"/>
          <path className="steam" d="M279 393Q266 383 280 373M293 393Q306 381 293 369" opacity=".5"/>
        </g>
        <g className="plant-layer">
          <path d="M727 369L738 413Q759 431 783 410L794 365" fill="var(--blue-light)"/>
          <ellipse cx="760" cy="367" rx="34" ry="12" fill="var(--paper)"/>
          <path d="M760 369Q752 308 787 263M760 348Q733 319 719 288M761 322Q775 299 817 307"/>
          <path d="M776 285Q754 259 790 234Q808 262 776 285ZM750 332Q713 332 702 286Q743 286 750 332ZM774 320Q786 287 828 300Q806 331 774 320ZM756 306Q725 288 739 252Q766 269 756 306Z" fill="var(--paper)"/>
          <path d="M777 280L787 248M741 319L714 298M784 313L813 304M754 294L743 267"/>
        </g>
        <g className="idea-layer">
          <path d="M761 174L822 186L813 244L750 231Z" fill="var(--accent)"/>
          <path d="M773 196L789 204L778 211M795 217L806 219"/>
          <path d="M252 271L257 255M246 260L264 267M693 324L698 308M687 313L705 320"/>
          <path d="M471 166Q466 147 480 142Q496 137 501 151Q504 163 491 173L489 185L478 181L479 171Z" fill="var(--paper)"/>
          <path d="M477 190L489 194M467 138L461 130M484 127V120M507 138L514 132"/>
        </g>
      </g>
    </svg>
  );
}
