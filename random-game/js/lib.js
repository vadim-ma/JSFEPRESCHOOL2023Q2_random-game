export function getRandomFromRange(min, max /*included*/) {
    return Math.trunc(Math.random() * (max - min + 1)) + min;
}
export function getElementChildIndex(child){
    const parent = child.parentNode;
    // The equivalent of parent.children.indexOf(child)
    return Array.prototype.indexOf.call(parent.children, child);
}