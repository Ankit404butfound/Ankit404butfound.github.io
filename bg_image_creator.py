from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw
import random

img = Image.open("bg/bg.png")

# font = ImageFont.truetype(<font-file>, <font-size>)
font = ImageFont.truetype("bitstream_vera_mono/VeraMono.ttf", 20)
# draw.text((x, y),"Sample Text",(r,g,b))
X, Y = img.size
img2 = Image.new(mode="RGB", size=(X, Y))
draw = ImageDraw.Draw(img2)
img2.paste(img)
print(X, Y)
_1_or_0 = "1"
delta = 1
r = 32
g = 58
b = 67
for x in range(X):
    r = 32
    g = 58
    b = 67
    if x%22 == 0:
        for y in range(Y-5):
            if y%22 == 0:
                #print(rgb)
                draw.text((x, y),_1_or_0,(r, g, b, 200),font=font)
                r -= delta
                g -= delta
                b -= delta
                _1_or_0 = random.choice("10")
        print(x, y)
img2.save('bg/bg0.png')