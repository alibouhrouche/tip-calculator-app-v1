const _id = <T extends HTMLElement>(id:string) => document.getElementById(id) as T|null

const tips = ['tip5','tip10','tip15','tip25','tip50'].map(v => _id<HTMLButtonElement>(v))
const [_bill,tipc,_nbpeople] = ['bill','tipc','nbpeople'].map(v => _id<HTMLInputElement>(v))
const input__nbpeople = _id<HTMLDivElement>('input__nbpeople')
const reset = _id<HTMLButtonElement>('reset')
const [_tip,_total] = ['tip','total'].map(v => _id<HTMLDivElement>(v))

const tipsValue = [.5,.10,.15,.25,.50]

let tip = .15,bill = 0,nbpeople = 1;
let activeTip = tips[2];
let lastTip = tips[2];

let out = {
    set tip(v: number){
        _tip!.textContent = `$${String(v)}`
    },
    set total(v: number){
        _total!.textContent = `$${String(v)}`
    }
}

function setValue(el:HTMLDivElement|null,v:number) {
    el!.textContent = `$${v.toFixed(2)}`
}

function handleTip(this:HTMLButtonElement) {
    activeTip?.classList.remove('active')
    this.classList.add('active')
    activeTip = this
    if(activeTip !== tipc){
        let i = tips.indexOf(activeTip)
        if(i > -1){
            tip = tipsValue[i]
            refresh()
        }
    }
}

function calculate(bill:number,tip:number,nb:number) {
    let tipValue = bill*(Number.isNaN(tip)?0:tip)
    tipValue = Number.isNaN(tipValue)?0:tipValue
    bill = Number.isNaN(bill)?0:bill
    nb = Number.isNaN(nb)?1:nb
    return [tipValue/nb,(bill+tipValue)/nb]
}

function refresh() {
    let [tipValue,totalValue] = calculate(bill,tip,nbpeople)
    setValue(_tip,tipValue)
    setValue(_total,totalValue)
}

[...tips,tipc].forEach(v => v?.addEventListener('click',handleTip))
tipc?.addEventListener('input',function () {
    tip = this.valueAsNumber/100
    refresh()
})
_bill?.addEventListener('input',function () {
    this.valueAsNumber = bill = Math.abs(this.valueAsNumber)
    refresh()
})
_nbpeople?.addEventListener('input',function () {
    let v = this.valueAsNumber = Math.abs(this.valueAsNumber)
    let invalid = isNaN(v) || v === 0
    input__nbpeople?.classList.toggle('invalid',invalid)
    if(!invalid){
        nbpeople = v
        refresh()
    }
})
reset?.addEventListener('click',function (){
    tipc!.value = "";
    _bill!.valueAsNumber = 0;
    _nbpeople!.valueAsNumber = 1;
    handleTip.call(tips[2]!);
    tip = .15;
    bill = 0;
    nbpeople = 1;
    refresh();
})