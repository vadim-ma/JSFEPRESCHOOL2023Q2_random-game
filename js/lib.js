export function getRandomFromRange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}
export function getElementChildIndex(child){
    const parent = child.parentNode;
    // The equivalent of parent.children.indexOf(child)
    return Array.prototype.indexOf.call(parent.children, child);
}