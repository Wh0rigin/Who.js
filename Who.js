function Who(dat) {
    this._BeginDestory = false;

    this.set = function(target,key,val){
        
    }

    // 函数或直接对象
    const obj = dat.data instanceof Function ? dat.data() : dat.data;
    this._data = new Observer(obj);



    // 数据代理至Who实例,方便数据操作
    const keys = Object.keys(obj);
    keys.forEach((k) => {
        console.log(k);
        //把每一个属性都监视
        Object.defineProperty(this, k, {
            get: function reactiveGetter() {
                return this._data[k];
            },
            set: function reactiveSetter(newValue) {
                this._data[k] = newValue;
            },
        });
    });

    
}

//数据观察者
function Observer(obj) {
    //汇总对象中所有的属性形成一个数组
    const keys = Object.keys(obj);
    //遍历数组，把每一个属性都监视
    keys.forEach((k) => {
        //把每一个属性都监视
        Object.defineProperty(this, k, {
            get: function reactiveGetter() {
                //TODO 这里做包装:虚拟操作等

                // 数组需要用push..整体修改进行修改,所以不进行监视,但里面的对象数据还是要添加监视
                if(obj[k] instanceof Array){
                    return this.addObserverOnArray(obj[k]);
                }
                return obj[k] instanceof Object ? new Observer(obj[k]) : obj[k];
            },
            set: function reactiveSetter(newValue) {
                obj[k] = newValue;
            },
        });
    });
}

Observer.prototype.addObserverOnArray = function(arr){
    const keys = Object.keys(arr);
    //遍历数组，把每一个属性都监视
    keys.forEach((k) => {
        //对每个属性进行判断如果为对象且不为数组则改为observer
        if(arr[k] instanceof Object && !(arr[k] instanceof Array)){
            arr.splice(k,1,new Observer(arr[k]));
        }
    });
    return arr
}

Who.prototype.set = function(target,key,val){
    
}

// Who.prototype.$destroy = function () {
//     var vm = this;
//     if (vm._BeginDestory) return;
//     vm._BeginDestory = true;
//     //清除所有的属性
//     Object.keys(vm).forEach((k) => {
//         delete vm[k];
//     })  
// };

// function remove(arr, item) {
//     if (arr.length) {
//         var index = arr.indexOf(item);
//         if (index > -1) {
//             return arr.splice(index, 1);
//         }
//     }
// }


