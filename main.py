# 左侧电机
def LMotor(Dir: bool, Speed: number):
    if Dir == True:
        Motor.motor_pulse(12, Speed)
        Motor.motor_pulse(13, 0)
    else:
        Motor.motor_pulse(12, 0)
        Motor.motor_pulse(13, Speed)
# 右侧电机
def RMotor(Dir2: bool, Speed2: number):
    if Dir2 == True:
        Motor.motor_pulse(14, 0)
        Motor.motor_pulse(15, Speed2)
    else:
        Motor.motor_pulse(14, Speed2)
        Motor.motor_pulse(15, 0)
# 直行3
def straight3():
    LMotor(True, BasePWM * 4)
    RMotor(True, BasePWM * 4)
# 获取超声波雷达测量值  单位mm
def Get_UltraSonic():
    pins.digital_write_pin(DigitalPin.P14, 0)
    control.wait_micros(2)
    pins.digital_write_pin(DigitalPin.P14, 1)
    control.wait_micros(25)
    pins.digital_write_pin(DigitalPin.P14, 0)
    return pins.pulse_in(DigitalPin.P15, PulseValue.HIGH) * 0.172
def load_PIN(pin: str):
    global PIN_A, PIN_B, PIN_C
    PIN_A = 9
    PIN_B = 10
    PIN_C = 11
    if pin == "X1":
        A = 4095
        B = 0
        C = 0
    elif pin == "X2":
        A = 0
        B = 4095
        C = 0
    elif pin == "X3":
        A = 4095
        B = 4095
        C = 0
    elif pin == "X4":
        A = 0
        B = 0
        C = 4095
    elif pin == "X5":
        A = 4095
        B = 0
        C = 4095
    Motor.motor_pulse(PIN_A, A)
    Motor.motor_pulse(PIN_B, B)
    Motor.motor_pulse(PIN_C, C)
    basic.pause(18)
    return pins.analog_read_pin(AnalogPin.P1)
# 右侧LED
def RLED(Red: number, Green: number, Blue: number):
    Motor.motor_pulse(0, Red)
    Motor.motor_pulse(1, Green)
    Motor.motor_pulse(2, Blue)
def ana_to_sig():
    global sl2, sr2, smid2, gap
    sl2 = False
    sr2 = False
    smid2 = False
    gap = 200
    if SL > gap:
        sl2 = True
    if SR > gap:
        sr2 = True
    if SMID > gap:
        smid2 = True
# 右转
def turn_Right():
    LMotor(True, BasePWM * 2)
    RMotor(False, BasePWM * 2)
# 左转
def turn_Left():
    LMotor(False, BasePWM * 2)
    RMotor(True, BasePWM * 2)
# 刹车
def brake():
    LMotor(True, 0)
    RMotor(True, 0)
# 直行1
def straight1():
    LMotor(True, BasePWM)
    RMotor(True, BasePWM)
# 直行2
def straight2():
    LMotor(True, BasePWM * 2)
    RMotor(True, BasePWM * 2)
# 左侧LED
def LLED(Red2: number, Green2: number, Blue2: number):
    Motor.motor_pulse(6, Red2)
    Motor.motor_pulse(7, Green2)
    Motor.motor_pulse(8, Blue2)
"""

初始化

"""
ThreeBlackCounter = 0
Distance = 0
SMID = 0
SR = 0
SL = 0
gap = 0
smid2 = False
sr2 = False
sl2 = False
PIN_C = 0
PIN_B = 0
PIN_A = 0
BasePWM = 0
BasePWM = 900
serial.redirect_to_usb()

def on_forever():
    global SL, SMID, SR, Distance, ThreeBlackCounter
    # basic.show_string("Beihang",100)
    SL = load_PIN("X3")
    SMID = load_PIN("X2")
    SR = load_PIN("X1")
    Distance = Get_UltraSonic()
    # Distance=0
    serial.write_line("" + str(SL) + "," + ("" + str(SMID)) + "," + ("" + str(SR)) + "," + ("" + str(Distance)) + "," + ("" + str(ThreeBlackCounter)))
    # 模拟量转信号量
    ana_to_sig()
    # 判断动作
    if Distance < 50:
        brake()
    elif sl2 == True and sr2 == False:
        turn_Left()
        LLED(1023, 1023, 1023)
        RLED(0, 0, 0)
        ThreeBlackCounter = 0
    elif sl2 == False and sr2 == True:
        turn_Right()
        RLED(1023, 1023, 1023)
        LLED(0, 0, 0)
        ThreeBlackCounter = 0
    elif sl2 == False and sr2 == False:
        if smid2 == False:
            straight1()
            basic.show_icon(IconNames.HEART, 60)
            LLED(1023, 1023, 1023)
            RLED(1023, 1023, 1023)
            ThreeBlackCounter = 0
        else:
            straight2()
            LLED(2047, 2047, 2047)
            RLED(2047, 2047, 2047)
            ThreeBlackCounter = 0
    elif sl2 == True and sr2 == True and smid2 == True:
        ThreeBlackCounter = ThreeBlackCounter + 1
        if ThreeBlackCounter < 5:
            straight1()
            LLED(1023, 1023, 1023)
            RLED(1023, 1023, 1023)
        else:
            RLED(0, 0, 0)
            LLED(0, 0, 0)
            brake()
    else:
        # straight3();
        straight1()
        LLED(1023, 1023, 1023)
        RLED(1023, 1023, 1023)
        ThreeBlackCounter = 0
basic.forever(on_forever)
