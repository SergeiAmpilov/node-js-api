function Component(id: number) {
  
  console.log('init component');
  return (target: Function) => {
    console.log('run component');
    target.prototype.id = id;
  }
}


function Logger() {
  console.log('init logger');
  return (target: Function) => {
    console.log('run logger');
  }
}


@Logger()
@Component(15)
export class User {
    id: Number;
    
    updateId(newId: number) {
      this.id = newId;
      return this.id;      
    }
}

console.log(new User().id);