/**
 * 初始化
 */
// 左侧电机
function LMotor (Dir: boolean, Speed: number) {
    if (Dir == true) {
        Motor.MotorPulse(12, Speed)
        Motor.MotorPulse(13, 0)
    } else {
        Motor.MotorPulse(12, 0)
        Motor.MotorPulse(13, Speed)
    }
}
// 右侧电机
function RMotor (Dir2: boolean, Speed2: number) {
    if (Dir2 == true) {
        Motor.MotorPulse(14, 0)
        Motor.MotorPulse(15, Speed2)
    } else {
        Motor.MotorPulse(14, Speed2)
        Motor.MotorPulse(15, 0)
    }
}
// 直行3
function straight3 () {
    LMotor(true, BasePWM * 4)
    RMotor(true, BasePWM * 4)
}
// 获取超声波雷达测量值  单位mm
function Get_UltraSonic () {
    pins.digitalWritePin(DigitalPin.P14, 0)
    control.waitMicros(2)
    pins.digitalWritePin(DigitalPin.P14, 1)
    control.waitMicros(25)
    pins.digitalWritePin(DigitalPin.P14, 0)
    return pins.pulseIn(DigitalPin.P15, PulseValue.High) * 0.172
}
function load_PIN (pin: string) {
    let A: number;
let B: number;
let C: number;
PIN_A = 9
    PIN_B = 10
    PIN_C = 11
    if (pin == "X1") {
        A = 4095
        B = 0
        C = 0
    } else if (pin == "X2") {
        A = 0
        B = 4095
        C = 0
    } else if (pin == "X3") {
        A = 4095
        B = 4095
        C = 0
    } else if (pin == "X4") {
        A = 0
        B = 0
        C = 4095
    } else if (pin == "X5") {
        A = 4095
        B = 0
        C = 4095
    }
    Motor.MotorPulse(PIN_A, A)
    Motor.MotorPulse(PIN_B, B)
    Motor.MotorPulse(PIN_C, C)
    basic.pause(18)
    return pins.analogReadPin(AnalogPin.P1)
}
// 右侧LED
function RLED (Red: number, Green: number, Blue: number) {
    Motor.MotorPulse(0, Red)
    Motor.MotorPulse(1, Green)
    Motor.MotorPulse(2, Blue)
}
function ana_to_sig () {
    sl2 = false
    sr2 = false
    smid2 = false
    gap = 200
    if (SL > gap) {
        sl2 = true
    }
    if (SR > gap) {
        sr2 = true
    }
    if (SMID > gap) {
        smid2 = true
    }
}
// 右转
function turn_Right () {
    LMotor(true, BasePWM * 2)
    RMotor(false, BasePWM * 2)
}
// 左转
function turn_Left () {
    LMotor(false, BasePWM * 2)
    RMotor(true, BasePWM * 2)
}
// 刹车
function brake () {
    LMotor(true, 0)
    RMotor(true, 0)
}
// 直行1
function straight1 () {
    LMotor(true, BasePWM)
    RMotor(true, BasePWM)
}
// 直行2
function straight2 () {
    LMotor(true, BasePWM * 2)
    RMotor(true, BasePWM * 2)
}
// 左侧LED
function LLED (Red2: number, Green2: number, Blue2: number) {
    Motor.MotorPulse(6, Red2)
    Motor.MotorPulse(7, Green2)
    Motor.MotorPulse(8, Blue2)
}
let ThreeBlackCounter = 0
let Distance = 0
let SMID = 0
let SR = 0
let SL = 0
let gap = 0
let smid2 = false
let sr2 = false
let sl2 = false
let PIN_C = 0
let PIN_B = 0
let PIN_A = 0
let BasePWM = 0
BasePWM = 900
serial.redirectToUSB()
basic.forever(function () {
    // basic.show_string("Beihang",100)
    SL = load_PIN("X3")
    SMID = load_PIN("X2")
    SR = load_PIN("X1")
    Distance = Get_UltraSonic()
    // Distance=0
    serial.writeLine("" + SL + "," + ("" + SMID) + "," + ("" + SR) + "," + ("" + Distance) + "," + ("" + ThreeBlackCounter))
    // 模拟量转信号量
    ana_to_sig()
    // 判断动作
    if (Distance < 50) {
        brake()
        LLED(1023, 0, 0)
        RLED(1023, 0, 0)
    } else if (sl2 == true && sr2 == false) {
        turn_Left()
        LLED(0, 1023, 0)
        RLED(0, 0, 0)
        ThreeBlackCounter = 0
    } else if (sl2 == false && sr2 == true) {
        turn_Right()
        RLED(0, 1023, 0)
        LLED(0, 0, 0)
        ThreeBlackCounter = 0
    } else if (sl2 == false && sr2 == false) {
        if (smid2 == false) {
            straight1()
            basic.showIcon(IconNames.Heart, 60)
LLED(1023, 1023, 1023)
            RLED(1023, 1023, 1023)
            ThreeBlackCounter = 0
        } else {
            straight2()
            LLED(2047, 2047, 2047)
            RLED(2047, 2047, 2047)
            ThreeBlackCounter = 0
        }
    } else if (sl2 == true && sr2 == true && smid2 == true) {
        ThreeBlackCounter = ThreeBlackCounter + 1
        if (ThreeBlackCounter < 5) {
            straight1()
            LLED(1023, 1023, 1023)
            RLED(1023, 1023, 1023)
        } else {
            RLED(0, 0, 0)
            LLED(0, 0, 0)
            brake()
        }
    } else {
        // straight3();
        straight1()
        LLED(1023, 1023, 1023)
        RLED(1023, 1023, 1023)
        ThreeBlackCounter = 0
    }
})
