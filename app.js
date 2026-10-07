// 화면 전환: 주소(#id)가 가리키는 섹션과 data-view가 같은 섹션만 보인다.
// 숨김 규칙은 style.css의 @media screen 안에만 있어 인쇄(PDF)는 8쪽 모두 나온다.
// js 클래스를 여기서 붙이므로 이 파일이 안 불리면 숨김도 없다(한 페이지로 보임).
document.documentElement.classList.add('js');
const pages = [...document.querySelectorAll('section.page')];
const links = [...document.querySelectorAll('.site-nav a')];

function show() {
  const target = document.getElementById(location.hash.slice(1));  // id는 모두 영문이라 디코딩 불필요(잘못된 %도 예외 없음)
  const view = target?.closest('section.page')?.dataset.view || 'home';
  pages.forEach(p => p.classList.toggle('on', p.dataset.view === view));
  links.forEach(a => {
    const isCurrent = document.getElementById(a.hash.slice(1)).dataset.view === view;
    isCurrent ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  scrollTo(0, 0);
}

// 로딩 중에 브라우저가 #id 위치로 내린 스크롤을 되돌린다. Chrome은 load까지 그 위치를 다시 잡으므로
// load까지 지켜보되, 사용자가 휠·터치·키보드로 직접 스크롤하기 시작하면 그 스크롤은 건드리지 않는다.
let watching = true;
const undoAnchor = () => { if (watching && scrollY) scrollTo(0, 0); };
const stopUndo = () => { watching = false; };
addEventListener('scroll', undoAnchor);
for (const t of ['wheel', 'touchmove', 'keydown']) addEventListener(t, stopUndo, {once: true, passive: true});
addEventListener('load', () => { undoAnchor(); stopUndo(); });

addEventListener('hashchange', show);
show();
