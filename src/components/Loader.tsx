import "./loader.css";
export const Loader = () => (
  <div class="lds-ring-container">
    <div class="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
);

export const wait = async (ms: number) => new Promise((res) => {
  setTimeout(() => res(1), ms);
})
