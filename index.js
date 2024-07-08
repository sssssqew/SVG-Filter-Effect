const mainSlider = document.querySelector('.slider-main')
const innerSliderOne = mainSlider.querySelector('.slider-inner-one')
const innerSliderTwo = mainSlider.querySelector('.slider-inner-two')
console.log(innerSliderTwo)
const images = [...mainSlider.querySelectorAll('svg')]
const imageItems = []

let current = 0
let target = 0
let ease = 0.075

window.addEventListener('resize', init)

function lerp(start, end, t){
    return start * (1 - t) + end * t
}

// 수평스크롤 이동거리 : 메인슬라이더 너비 - 브라우저 너비 
// 바디높이: 브라우저 높이 + 수평스크롤 이동거리 
function init(){
    document.body.style.height = `${mainSlider.getBoundingClientRect().width - (window.innerWidth - window.innerHeight)}px`
}
function transfromElement(el, transform){
    el.style.transform = transform
}
function animate(){
    // console.log('스크롤', window.scrollY)
    target = window.scrollY 
    current = lerp(current, target, ease).toFixed(2)
    transfromElement(mainSlider, `translate3d(${-current}px, 0, 0)`)
    transfromElement(innerSliderTwo, `translate3d(${-current * 1.1}px, 0, 0)`)

    console.log("현재", current, "타켓", target) 

    for(let i=0; i<imageItems.length; i++){
        imageItems[i].render()
        if(current < (target - 50) || current > (target + 50)){ // current 가 target 에 +-50px 만큼 근접하기 전까지는 사진이 작다가 근접하면 원래 크기로 돌아옴
            transfromElement(imageItems[i].el, 'scale(0.8)')
        }else{
            transfromElement(imageItems[i].el, 'scale(1)')
        }
    }
    requestAnimationFrame(animate)
}
// Intersection observer options
const options = {
    rootMargin: '0px',
    threshold: .9 // 요소(svg)가 90% 보일때 콜백함수 호출
}
class ImageItem{
    constructor(el){
        this.el = el 
        this.isVisible = false
        this.observer = new IntersectionObserver(entries => {
            // console.log(entries)
            entries.forEach(entry => this.isVisible = entry.isIntersecting)
        }, options)
        this.observer.observe(this.el)
        this.current = 150
        this.target = 150
        this.ease = 0.1
        this.setDisplacement()
    }
    setDisplacement(){
        this.el.querySelector('feDisplacementMap').scale.baseVal = this.current 
    }
    render(){
        if(this.isVisible && this.target != 0){
            this.target = 0
            this.el.classList.add('active')
        }
        this.current = lerp(this.current, this.target, this.ease).toFixed(2)
        this.el.querySelector('feDisplacementMap').scale.baseVal = this.current 
    }
}
images.forEach(image => {
    imageItems.push(new ImageItem(image))
})

init()
animate()


