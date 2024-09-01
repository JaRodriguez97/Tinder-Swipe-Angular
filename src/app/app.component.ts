import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Card } from './interfaces/card.interface';
// import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private readonly DESICION_THRESHOLD: number = 150;
  private isAnimate: boolean = false;
  private pullDeltaX: number = 0;
  private actualCard: HTMLElement | null = null;
  private startX!: number;
  public cards!: Array<Card>;

  title = 'Tinder-Swipe-Angular';

  constructor(@Inject(DOCUMENT) private document: Document) {
    // private appService: AppService
    // appService.getUsersApi().subscribe((data) => {
    //   console.log(data);
    // });
    this.cards = [
      {
        src: '../assets/photos/2.webp',
        alt: 'Alex, brown hair man, 25 years old',
        nombre: 'Alex',
        edad: 25,
      },
      {
        src: '../assets/photos/1.webp',
        alt: 'Leila, brown hair man, 27 years old',
        nombre: 'Leila',
        edad: 27,
      },
    ];
  }

  @HostListener('document:mousedown', ['$event'])
  startDragMouse(event: MouseEvent) {
    this.startDrag(event);
  }

  @HostListener('document:touchstart', ['$event'])
  startDragToush(event: TouchEvent) {
    this.startDrag(event);
  }

  ngOnInit(): void {}

  startDrag = (event: MouseEvent | TouchEvent) => {
    if (this.isAnimate) return;

    this.actualCard =
      event.target instanceof HTMLElement
        ? event.target.closest('article')
        : null;

    if (!this.actualCard) return;

    this.startX =
      (event as TouchEvent).touches?.[0]?.pageX || (event as MouseEvent).pageX;

    this.document.addEventListener('mousemove', this.onMove);
    this.document.addEventListener('mouseup', this.onEnd);

    this.document.addEventListener('touchmove', this.onMove, { passive: true });
    this.document.addEventListener('touchend', this.onEnd, { passive: true });
  };

  onMove = (event: MouseEvent | TouchEvent) => {
    const currentX =
      (event as TouchEvent).touches?.[0]?.pageX || (event as MouseEvent).pageX;

    this.pullDeltaX = currentX - this.startX;

    if (this.pullDeltaX === 0) return;

    if (this.actualCard instanceof HTMLElement) {
      this.isAnimate = true;

      const deg = this.pullDeltaX / 14;

      this.actualCard.style.transform = `translateX(${this.pullDeltaX}px) rotate(${deg}deg)`;
      this.actualCard.style.cursor = 'grabbing';

      const opacity = (Math.abs(this.pullDeltaX) / 100).toString();
      const isRight = this.pullDeltaX > 0;

      const choiceEl = isRight
        ? this.actualCard.querySelector('.choice.like')!
        : this.actualCard.querySelector('.choice.nope')!;

      (choiceEl as HTMLElement).style.opacity = opacity;
    }
  };

  onEnd = () => {
    this.document.removeEventListener('mousemove', this.onMove);
    this.document.removeEventListener('mouseup', this.onEnd);

    this.document.removeEventListener('touchmove', this.onMove);
    this.document.removeEventListener('touchend', this.onEnd);

    const desicionMade = Math.abs(this.pullDeltaX) >= this.DESICION_THRESHOLD;

    if (this.actualCard instanceof HTMLElement && desicionMade) {
      const goRight = this.pullDeltaX > 0;

      this.actualCard.classList.add(goRight ? 'go-right' : 'go-left');
      this.actualCard.addEventListener('transitionend', () =>
        this.actualCard!.remove()
      );
    } else if (this.actualCard instanceof HTMLElement) {
      this.actualCard.classList.add('reset');
      this.actualCard.classList.remove('go-left', 'go-right');

      this.actualCard
        .querySelectorAll('.choice')
        .forEach(
          (element: Element) => ((element as HTMLElement).style.opacity = '0')
        );
    }

    this.actualCard!.addEventListener('transitionend', (e) => {
      if (e.propertyName !== "transform") return;

      if (this.actualCard instanceof HTMLElement) {
        this.actualCard.removeAttribute('style');
        this.actualCard.classList.remove('reset');

        this.isAnimate = false;

        this.pullDeltaX = 0;
      }
    });
  };
}
