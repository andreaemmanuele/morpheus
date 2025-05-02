import { Pill, Rainbow, Pyramid, Ratio, Sprout, PawPrint, Baby, HeartPulse, Gem, ShoppingCart, TreePine, Pizza, Dog, Cat, Guitar, Camera, CassetteTape, Zap, SquareCode, Square, Circle, Rocket, BicepsFlexed, } from 'lucide-react';
import { createElement } from 'react';
export const iconList = {
    pill: Pill,
    rainbow: Rainbow,
    pyramid: Pyramid,
    ratio: Ratio,
    sprout: Sprout,
    pawPrint: PawPrint,
    baby: Baby,
    heartPulse: HeartPulse,
    gem: Gem,
    shoppingCart: ShoppingCart,
    treePine: TreePine,
    pizza: Pizza,
    dog: Dog,
    cat: Cat,
    guitar: Guitar,
    camera: Camera,
    cassetteTape: CassetteTape,
    zap: Zap,
    squareCode: SquareCode,
    square: Square,
    circle: Circle,
    rocket: Rocket,
    carFront: Cat,
    bicepsFlexed: BicepsFlexed,
};
export const renderIcon = (name) => createElement(iconList[name]);
