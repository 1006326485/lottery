(function(){
    var choosed = JSON.parse(localStorage.getItem('choosed')) || {};
    var speed = function(){
        return [0.1 * Math.random() + 0.01, -(0.1 * Math.random() + 0.01)];
    };
    var getKey = function(item){
        return item.name + '-' + item.last_name;
    };
    var createHTML = function(){
        var html = [ '<ul>' ];
        member.forEach(function(item, index){
            item.index = index;
            var key = getKey(item);
            var color = choosed[key] ? 'yellow' : 'white';
            html.push('<li><a href="#" style="color: ' + color + ';">' + item.name + '</a></li>');
        });
        html.push('</ul>');
        return html.join('');
    };

    var lottery = function(targets, count){
        var list = canvas.getElementsByTagName('a');
        var color = 'yellow';
        var ret = member
            .filter(function(m, index){
                m.index = index;
                return !choosed[getKey(m)];
            })
            .map(function(m){
                var obj = Object.assign({
                    score: parseInt(Math.random()*100)
                  }, m);
                  // Judge names, if true, raise up it 
                for(var i in targets){
                    if(i == obj.name){
                        obj.score = targets[i];
                    }else{

                    }
                }
                return obj;
            })
            .sort(function(a, b){
                return a.score - b.score;
            })
            .slice(0, count)
            .map(function(m){
              choosed[getKey(m)] = 1;
              list[m.index].style.color = color;
              return m.name + ' ' + m.last_name;
            });
        localStorage.setItem('choosed', JSON.stringify(choosed));
        console.log(ret);
        return ret;
    };
    var canvas = document.createElement('canvas');
    canvas.id = 'myCanvas';
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight;
    document.getElementById('main').appendChild(canvas);
    var control = 0;
    new Vue({
        el: '#tools',
        data: {
            selected: 6,
            running: false,
            btns: [
                10, 6, 5, 2, 1
            ]
        },
        ready: function(){
            canvas.innerHTML = createHTML();
            TagCanvas.Start('myCanvas', '', {
                textColour: null,
                initial: speed(),
                dragControl: 1,
                textHeight: 34
            });
        },
        methods: {
            reset: function(){
                if(confirm('确定要重置吗？')){
                    localStorage.clear();
                    location.reload(true);
                }
            },
            onClick: function(num){
                $('#result').css('display', 'none');
                $('#main').removeClass('mask');
                this.selected = num;
            },
            toggle: function(){
                if(this.running){
                    TagCanvas.SetSpeed('myCanvas', speed());
                    var ret = [];
                    //Direct targer 
                    if(control == 0){
                        //传入名字与概率， 数字越小概率越高
                        ret = lottery({"":0}, this.selected);
                        // ret = lottery({"Adam": 0, "Marcus": 100}, this.selected);
                        control = 1;
                    }else{
                        // ret = lottery({"Marcus": 0}, this.selected);
                        ret = lottery({"":0}, this.selected);
                    }
                    // var ret = lottery(this.selected);
                    $('#result').css('display', 'block').html('<span class="scaleTime" style="display:none;">' + ret.join('</span><span class="scaleTime" style="display:none;">') + '</span>');
                    TagCanvas.Reload('myCanvas');
                    setTimeout(function(){
                        localStorage.setItem(new Date().toString(), JSON.stringify(ret));
                        $('#main').addClass('mask');
                    }, 0);
                    let results = document.getElementsByClassName("scaleTime");
                    let i = 0;
                    
                    document.getElementById("lottery_sound").pause();
                    let animations = setInterval(function(){
                        if(i == results.length-1){
                            clearInterval(animations)
                        }
                        console.log(i)
                        results[i].style.display = "inline-block";
                        results[i].classList.add("spendTime");
                        
                        setTimeout(function(){
                            document.getElementById("sound").play()
                            // console.log($('#sound').play());
                        },);
                        i++;
                    },2000);
                    // console.log("抽到的是:")
                    // console.log(ret);
                    // console.log("-----------")

                } else {
                    $('#result').css('display', 'none');
                    $('#main').removeClass('mask');
                    document.getElementById("lottery_sound").play();
                    TagCanvas.SetSpeed('myCanvas', [5, 1]);
                }
                this.running = !this.running;
            }
        }
    });
})();