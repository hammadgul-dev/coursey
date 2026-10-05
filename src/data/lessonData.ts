export let modules = [
  {
    title: "Foundational Theory",
    lessons: [
      {id: 1, t: "Subtyping & Variance", m: 6},
      {id: 2, t: "Type Space vs Value", m: 10},
    ],
  },
  {
    title: "Type Manipulation",
    lessons: [
      {id: 3, t: "Mapped Types & Remapping", m: 7},
      {id: 4, t: "Conditional & Infer", m: 12},
      {id: 5, t: "Template Literal Types", m: 9},
      {id: 6, t: "Recursive Depth Caps", m: 15},
    ],
  },
  {
    title: "Compiler Internals",
    lessons: [
      {id: 7, t: "Type Checker Pipeline", m: 18, locked: true},
      {id: 8, t: "AST Transformations", m: 22, locked: true},
    ],
  },
]

export let allLessons = modules.flatMap((m) =>
  m.lessons.map((l: any) => ({...l, module: m.title})),
)

export let doneInitial = [1, 2, 3]

export let rules = [
  {
    b: "Naked Distribution",
    t: "A generic parameter T distributes over unions only when unchecked by enclosing structures.",
  },
  {
    b: "Tuple Guarding",
    t: "Wrapping the parameter in a single-element tuple disables union splitting.",
  },
  {
    b: "Inferential Anchoring",
    t: "The infer keyword introduces a placeholder the compiler solves during unification.",
  },
]

export let diagram = [
  {
    label: "Input Union",
    value: "A | B | C",
    desc: "Raw incoming polymorphic type parameter",
  },
  {
    label: "Distribution Pass",
    value: "F | F | F",
    desc: "Parallel mapping across independent branches",
  },
  {
    label: "Normalized Result",
    value: "Flattened Union",
    desc: "Automatic deduplication and never elimination",
  },
]

export let code = `type FlattenPayload<T> =
  T extends Promise<infer R>
    ? FlattenPayload<R>
    : T extends (infer E)[]
      ? FlattenPayload<E>
      : T;

type SampleA = FlattenPayload<Promise<string[] | number>>;

type StrictNoDistribute<T> = [T] extends [never] ? true : false;`

export let checkpoint = {
  q: "Why check [T] against [never]?",
  a: "A bare T extends never distributes over an empty union and returns never. Wrapping in a tuple stops distribution, so the check evaluates once and returns a real true or false.",
}
