import BinTools  from "../../src/utils/bintools";
import BN  from "bn.js";
import {Buffer} from "buffer/";
import createHash from "create-hash";

const bintools = BinTools.getInstance();

describe('BinTools', () => {
    let hexstr:string = "00112233445566778899aabbccddeeff";
    let hexstr2:string = "0001020304050607080909080706050403020100";
    let hexstr3:string = "0001020304050607080909080706050403020101"
    let b58str:string = "1UoWww8DGaVGLtea7zU7p";
    let b58str2:string = "1Bhh3pU9gLXZiJv73kmqZwHJ4F"
    let b58str3:string = "1Bhh3pU9gLXZiJv73kmqZwHJ4G";
    let buff:Buffer = Buffer.from(hexstr, "hex");
    let buff2:Buffer = Buffer.from(hexstr2, "hex");
    let buff3:Buffer = Buffer.from(hexstr3, "hex");
    let checksum:string = "323e6811";
    let serializedChecksum:string = "148vjpuxYXixb8DcbaWyeDE2fEG"; //serialized hexstr + checksum
    test('copyFrom conducts a true copy', () => {
        let buff:Buffer = Buffer.from(hexstr, "hex");
        let newbuff:Buffer = bintools.copyFrom(buff, 0, 10);
        expect(newbuff.length).toBe(10);
        expect(newbuff.readUInt8(0)).toBe(0);
        expect(newbuff.readUInt8(9)).toBe(153);
        //verify that the original buffer isn't touched by writes
        newbuff.writeUInt8(153, 4);
        expect(newbuff.readUInt8(4)).toBe(153);
        expect(buff.readUInt8(4)).toBe(68);
        //test with no end specified
        let newbuff2:Buffer = bintools.copyFrom(buff, 2);
        expect(newbuff2.length).toBe(14);
        expect(newbuff2.readUInt8(0)).toBe(34);
        expect(newbuff2.readUInt8(7)).toBe(153);
    });

    test('bufferToB58', () => {
        let b58res:string = bintools.bufferToB58(buff);
        expect(b58res).toBe(b58str);
        // testing null character edge case
        let b58res2:string = bintools.bufferToB58(buff2);
        expect(b58res2).toBe(b58str2);
        // testing null character edge case
        let b58res3:string = bintools.bufferToB58(buff3);
        expect(b58res3).toBe(b58str3);
    });

    test('b58ToBuffer', () => {
        expect(() => {
            bintools.b58ToBuffer("0OO0O not a valid b58 string 0OO0O")
        }).toThrow("Error - Base58.decode: not a valid base58 string");
        
        let buffres:Buffer = bintools.b58ToBuffer(b58str);
        expect(buffres.toString()).toBe(buff.toString());
        // testing zeros character edge case
        let buffres2:Buffer = bintools.b58ToBuffer(b58str2);
        expect(buffres2.toString()).toBe(buff2.toString());
        // testing zeros character edge case
        let buffres3:Buffer = bintools.b58ToBuffer(b58str3);
        expect(buffres3.toString()).toBe(buff3.toString());
    });

    test('fromBufferToArrayBuffer', () => {
        let arrbuff:ArrayBuffer = bintools.fromBufferToArrayBuffer(buff);
        expect(arrbuff.byteLength).toBe(buff.length);
        for(let i:number = 0; i < buff.length; i++){
            expect(arrbuff[i]).toBe(buff[i]);
        }
        //verify that the original buffer isn't touched by writes
        arrbuff[2] = 55;
        expect(buff[2]).not.toBe(55);
    });

    test('fromArrayBufferToBuffer', () => {
        let arrbuff:ArrayBuffer = new ArrayBuffer(10);
        for(let i:number = 0; i < 10; i++){
            arrbuff[i] = i;
        }
        let newbuff:Buffer = bintools.fromArrayBufferToBuffer(arrbuff);
        expect(newbuff.length).toBe(arrbuff.byteLength);
        for(let i:number = 0; i < newbuff.length; i++){
            expect(newbuff[i]).toBe(arrbuff[i]);
        }
        //verify that the original buffer isnt touched by writes
        newbuff[3] = 55;
        expect(arrbuff[3]).not.toBe(newbuff[3]);
    });

    test('fromBufferToBN', () => {
        let bign:BN = bintools.fromBufferToBN(buff);
        expect(bign.toString("hex", hexstr.length)).toBe(hexstr);
    });

    test('fromBNToBuffer', () => {
        let bn1:BN = new BN(hexstr, "hex", "be");
        let bn2:BN = new BN(hexstr, "hex", "be");
        let b1:Buffer = bintools.fromBNToBuffer(bn1);
        let b2:Buffer = bintools.fromBNToBuffer(bn2, buff.length);
        
        expect(b1.length).toBe(buff.length - 1);
        expect(b1.toString("hex")).toBe(hexstr.slice(2));

        expect(b2.length).toBe(buff.length);
        expect(b2.toString("hex")).toBe(hexstr);
        
    });

    test('addChecksum', () => {
        let buffchecked:Buffer = bintools.addChecksum(buff);
        expect(buffchecked.length).toBe(buff.length + 4);
        expect(buffchecked.slice(16).toString("hex")).toBe(checksum);
    });

    test('validteChecksum', () => {
        let checksummed:string = hexstr + checksum;
        let badsummed:string = hexstr + "324e7822";
        expect(bintools.validateChecksum(Buffer.from(checksummed, "hex"))).toBe(true);
        expect(bintools.validateChecksum(buff)).toBe(false);
        expect(bintools.validateChecksum(Buffer.from(badsummed, "hex"))).toBe(false);
    });

    test('avaSerialize', () => {
        let fromBuff:string = bintools.avaSerialize(buff);
        expect(fromBuff).toBe(serializedChecksum);
    });

    test('avaDeserialize', () => {
        let serbuff:Buffer = bintools.b58ToBuffer(serializedChecksum);
        let dsr1:Buffer = bintools.avaDeserialize(serializedChecksum);
        let dsr2:Buffer = bintools.avaDeserialize(serbuff);
        let serbufffaulty:Buffer = bintools.copyFrom(serbuff)
        serbufffaulty[serbufffaulty.length - 1] = serbufffaulty[serbufffaulty.length - 1] - 1;
        expect(dsr1.toString("hex")).toBe(hexstr);
        expect(dsr2.toString("hex")).toBe(hexstr);
        expect(() => {
            bintools.avaDeserialize(serbufffaulty);
        }).toThrow("Error - BinTools.avaDeserialize: invalid checksum");
    });
});