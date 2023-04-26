import { _decorator, Component, Node, input, Input, EventMouse ,Vec3  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('playerController')
export class playerController extends Component {
    // 是否接收到跳跃指令
    private _startJump: boolean = false;
    // 跳跃步长
    private _jumpStep: number = 0;
    // 当前跳跃时间
    private _curJumpTime: number = 0;
    // 每次跳跃时长
    private _jumpTime: number = 0.1;
    // 当前跳跃速度
    private _curJumpSpeed: number = 0;
    // 当前角色位置
    private _curPos: Vec3 = new Vec3();
    // 每次跳跃过程中，当前帧移动位置差
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    // 角色目标位置
    private _targetPos: Vec3 = new Vec3();

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        console.info("开始监听鼠标按键")
    }

    update (deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) { // 跳跃结束
                // end
                this.node.setPosition(this._targetPos);  // 强制位移到目标位置
                this._startJump = false; // 标记跳跃结束

            } else { // 跳跃中
                // tween
                this.node.getPosition(this._curPos);  // 获取当前的位置
                this._deltaPos.z = this._curJumpSpeed * deltaTime; // 计算本帧应该位移的长度
                Vec3.add(this._curPos, this._curPos, this._deltaPos); // 将当前位置加上位移的长度
                this.node.setPosition(this._curPos); // 设置位移后的位置
            }
        }
    }

    onMouseUp(event: EventMouse) {
        let mouseCode = event.getButton();
        console.info("鼠标 按键code："+mouseCode)
        switch (mouseCode) {
            case 0:
                console.info("鼠标左键");
                this.jumpByStep(1);
                return;
            case 1:
                console.info("鼠标中键");
                return;
            case 2:
                console.info("鼠标右键");
                this.jumpByStep(2);
                return;
            default :
                console.warn("未知鼠标按键")
                return;
        }

    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true; // 表示开始跳跃
        this._jumpStep = step; // 本次跳跃的步数
        this._curJumpTime = 0; // 重置下跳跃的时间
        this._curJumpSpeed = this._jumpStep / this._jumpTime; // 计算跳跃的速度
        this.node.getPosition(this._curPos); // 获取角色当前的位置
        // 目标位置 = 当前位置 + 步长
        Vec3.add(this._targetPos, this._curPos, new Vec3(0, 0, this._jumpStep));
    }
}

