import p5 from "p5";

const width: number = 800;
const height: number = 500;
const padding: number = 50;

let sketch = function (p) {
  p.setup = function () {
    p.createCanvas(width, height);

    p.strokeWeight(3);
    p.stroke("blue");

    // x and y axes
    p.line(padding, padding, padding, height - padding);
    p.line(padding, height - padding, width - padding, height - padding);

    // y-axis arrow head
    p.line(padding, padding, padding - 5, padding + 5);
    p.line(padding, padding, padding + 5, padding + 5);

    // x-axis arrow head
    p.line(
      width - padding,
      height - padding,
      width - padding - 5,
      height - padding + 5
    );
    p.line(
      width - padding,
      height - padding,
      width - padding - 5,
      height - padding - 5
    );

    p.strokeWeight(0);
    p.text("(0, 0)", padding + 10, height - 30);
  };

  class Point {
    x: number;
    y: number;
    p;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    draw(): void {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(800);
      p.point(this.x, this.y);
    }

    drawTo(that: Point) {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(200);
      p.line(this.x, this.y, that.x, that.y);
    }

    slopeTo(other: Point): number {
      if (this.x === other.x) {
          if (this.y === other.y) {
              return Number.NEGATIVE_INFINITY; // degenerate line segment (duplicate point)
          } else {
              return Number.POSITIVE_INFINITY; // vertical line segment
          }
      } else {
          return (other.y - this.y) / (other.x - this.x);
      }
  }
    compareTo(other: Point): number {
      if (this.y < other.y || (this.y === other.y && this.x < other.x)) {
          return -1;
      } else if (this.y === other.y && this.x === other.x) {
          return 0;
      } else {
          return 1;
      }
  }
  }

  class LineSegment {
    p: Point;
    q: Point;

    constructor(p: Point, q: Point) {
      // DO NOT MODIFY

      this.p = p;
      this.q = q;
    }

    draw(): void {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(2);
      p.line(this.p.x, this.p.y, this.q.x, this.q.y);
    }

    toString(): string {
      // DO NOT MODIFY

      return `${this.p} -> ${this.q}`
    }
  }

  class BruteCollinearPoints {
    private segments: LineSegment[];

    constructor(points: Point[]) {
        if (points === null) throw new Error("null argument to constructor");
        this.segments = [];
        this.checkNull(points);

        for (let i = 0; i < points.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < points.length; j++) {
                if (points[j].compareTo(points[minIndex]) < 0) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                const temp = points[i];
                points[i] = points[minIndex];
                points[minIndex] = temp;
            }
        }

        for (let i = 0; i < points.length - 3; ++i) {
            for (let j = i + 1; j < points.length - 2; ++j) {
                for (let k = j + 1; k < points.length - 1; ++k) {
                    for (let l = k + 1; l < points.length; ++l) {
                        if (
                            points[i].slopeTo(points[j]) === points[i].slopeTo(points[l]) &&
                            points[i].slopeTo(points[j]) === points[i].slopeTo(points[k])
                        ) {
                            const tempLineSegment = new LineSegment(points[i], points[l]);
                            if (!this.segments.some(segment => this.areEqual(segment, tempLineSegment))) {
                                this.segments.push(tempLineSegment);
                            }
                        }
                    }
                }
            }
        }
    }

    public numberOfSegments(): number {
        return this.segments.length;
    }

    public getSegments(): LineSegment[] {
        return this.segments;
    }

    private checkNull(points: Point[]): void {
        for (let i = 0; i < points.length; i++) {
            if (points[i] === null) {
                throw new Error("One of the points in the points array is null");
            }
        }
    }

    private areEqual(firstLine: LineSegment, secondLine: LineSegment): boolean {
      return (
          (firstLine.p === secondLine.p && firstLine.q === secondLine.q) ||
          (firstLine.p === secondLine.q && firstLine.q === secondLine.p)
      );
  }
}

class FastCollinearPoints {
  private segment: LineSegment[];

  constructor(points: Point[]) {
      if (!points || points.some(point => !point)) {
          throw new Error("At least one point in array is null");
      }

      this.segment = [];
      const n = points.length;

      for (let i = 0; i < n; i++) {
          const origin = points[i];
          const slopes = new Map<number, Point[]>();

          for (let j = 0; j < n; j++) {
              if (i !== j) {
                  const slope = origin.slopeTo(points[j]);
                  if (!slopes.has(slope)) {
                      slopes.set(slope, []);
                  }
                  slopes.get(slope)!.push(points[j]);
              }
          }

          slopes.forEach((collinearPoints, slope) => {
              if (collinearPoints.length >= 3) {
                  collinearPoints.push(origin);
                  collinearPoints.sort((a, b) => a.compareTo(b));
                  if (collinearPoints[0] === origin) {
                      this.segment.push(new LineSegment(collinearPoints[0], collinearPoints[collinearPoints.length - 1]));
                  }
              }
          });
      }
  }

  numberOfSegments(): number {
      return this.segment.length;
  }

  segments(): LineSegment[] {
      return this.segment.slice();
  }
}

  // Declare your point objects here~
  // const point = new Point(19000, 10000);
  // const point2 = new Point(10000, 10000);

 
  const points: Point[] = [
    // //input8.txt
    new Point(10000,0),
    new Point( 0,10000),
    new Point(  6000,7000),
    new Point( 3000,7000),
    new Point( 7000,3000),
    new Point( 20000,21000),
    new Point( 14000,15000),
    new Point( 3000   ,4000),
    //inout20.tst
    new Point(4096,20992),
    new Point(5120 ,20992),
    new Point(6144 ,20992),
    new Point(7168 ,20992),
    new Point(8128 ,20992),
    new Point( 4096 ,22016),
    new Point(4096 ,23040),
    new Point(4096 ,24064),
    new Point(4096 ,25088),
    new Point( 5120 ,25088),
    new Point(7168 ,25088),
    new Point(8192 ,25088),
    new Point( 8192 ,26112),
    new Point(8192 ,27136),
    new Point( 8192 ,28160),
    new Point(8192 ,29184),
    new Point(4160 ,29184),
    new Point(5120 ,29184),
    new Point(6144 ,29184),
    new Point(7168, 29184),
    //input50.txt
    new Point( 26000 ,27000),
    new Point( 24000  ,23000),
    new Point( 18000  ,23000),
    new Point( 22000   ,9000),
    new Point( 25000  ,25000),
    new Point(  1000   ,2000),
    new Point( 12000  ,10000),
    new Point(22000  ,17000),
    new Point(25000   ,1000),
    new Point(15000   ,1000 ),

    new Point( 19000  ,28000),
    new Point( 12000   ,3000),
    new Point( 4000  ,15000),
    new Point(  2000   ,7000),
    new Point( 18000  ,27000),
    new Point(  1000  ,13000),
    new Point(  9000  ,26000),
    new Point( 11000  ,26000),
    new Point(  6000  ,16000),
    new Point( 18000  ,30000),

    new Point(18000  ,26000),
    new Point(24000  ,30000),
    new Point(10000  ,25000),
    new Point( 7000  ,10000),
    new Point(19000  ,24000),
    new Point(6000    ,  0),
    new Point(26000  ,15000),
    new Point(1000  ,23000),
    new Point(23000  ,29000),
    new Point(15000   ,7000),

    new Point(15000  ,19000),
    new Point(17000  ,31000),
    new Point(6000   ,2000),
    new Point(17000  ,16000),
    new Point(1000  ,26000),
    new Point(11000  ,19000),
    new Point(25000   ,   0),
    new Point(17000  ,30000),
    new Point(16000  ,22000),
    new Point(18000  ,13000),

    new Point(3000  ,23000),
    new Point(10000  ,13000),
    new Point(1000   ,9000),
    new Point(11000  ,21000),
    new Point(29000  ,19000),
    new Point(9000  ,29000),
    new Point(30000  , 3000),
    new Point(9000   ,1000),
    new Point(5000  ,29000),
    new Point(26000  , 6000),


    
  ];

  p.draw = function () {
    p.translate(padding, height - padding);
    p.scale(1/100, -1/100);

    // Call your draw and drawTo here.

    // point.draw();
    // point2.draw();
    // point.drawTo(point2);

    for (const point of points) {
      point.draw();
    }

    const Fastcollinear = new FastCollinearPoints(points);
    for (const segment of Fastcollinear.segments()) {
      console.log(segment.toString());
      segment.draw();
    }
    // const BruteCollinear = new BruteCollinearPoints(points);
		// for (const segment of BruteCollinear.getSegments()) {
		// 	console.log(segment.toString());
		// 	segment.draw();
		// }
  };
};

new p5(sketch);