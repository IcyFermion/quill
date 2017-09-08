class Tooltip {
  constructor(quill, boundsContainer) {
    this.quill = quill;
    this.boundsContainer = boundsContainer || document.body;
    this.root = quill.addContainer('ql-tooltip');
    this.root.innerHTML = this.constructor.TEMPLATE;
    if (this.quill.root === this.quill.scrollingContainer) {
      this.quill.root.addEventListener('scroll', () => {
        this.root.style.marginTop = (-1*this.quill.root.scrollTop) + 'px';
      });
    }
    this.hide();
  }

  hide() {
    this.root.classList.add('ql-hidden');
  }

  position(reference) {
    let left = reference.left + reference.width/2 - this.root.offsetWidth/2;
    // root.scrollTop should be 0 if scrollContainer !== root
    let top = reference.bottom + this.quill.root.scrollTop;
    const editorWidth = this.quill.root.getBoundingClientRect().width;
    const tooltipWidth = this.root.getBoundingClientRect().width;
    const leftStyleWithBound = (left, padding = 15) => `${Math.max(-padding, Math.min(editorWidth - tooltipWidth + padding, left))}px`
    this.root.style.left = leftStyleWithBound(left);
    this.root.style.top = top + 'px';
    this.root.classList.remove('ql-flip');
    let containerBounds = this.boundsContainer.getBoundingClientRect();
    let rootBounds = this.root.getBoundingClientRect();
    let shift = 0;
    if (rootBounds.right > containerBounds.right) {
      shift = containerBounds.right - rootBounds.right;
      this.root.style.left = leftStyleWithBound(left + shift);
    }
    if (rootBounds.left < containerBounds.left) {
      shift = containerBounds.left - rootBounds.left;
      this.root.style.left = leftStyleWithBound(left + shift);
    }
    if (rootBounds.bottom > containerBounds.bottom) {
      let height = rootBounds.bottom - rootBounds.top;
      let verticalShift = reference.bottom - reference.top + height;
      this.root.style.top = (top - verticalShift) + 'px';
      this.root.classList.add('ql-flip');
    }
    return shift;
  }

  show() {
    this.root.classList.remove('ql-editing');
    this.root.classList.remove('ql-hidden');
  }
}


export default Tooltip;
