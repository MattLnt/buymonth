"use client";
import { useRouter } from "next/navigation";

export default function FiltresClient() {
  function handleCaRange(e) {
    const form = e.target.closest("form");
    const [min, max] = e.target.value.split("-");
    
    // Supprime les anciens inputs caMin/caMax
    form.querySelectorAll('input[name="caMin"], input[name="caMax"]').forEach(el => el.remove());
    
    if (min) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "caMin";
      input.value = min;
      form.appendChild(input);
    }
    if (max) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "caMax";
      input.value = max;
      form.appendChild(input);
    }
  }

  return (
    <script dangerouslySetInnerHTML={{
      __html: `
        document.querySelectorAll('input[name="caRange"]').forEach(input => {
          input.addEventListener('change', function() {
            const form = this.closest('form');
            form.querySelectorAll('input[name="caMin"], input[name="caMax"]').forEach(el => el.remove());
            const [min, max] = this.value.split('-');
            if (min) { const i = document.createElement('input'); i.type='hidden'; i.name='caMin'; i.value=min; form.appendChild(i); }
            if (max) { const i = document.createElement('input'); i.type='hidden'; i.name='caMax'; i.value=max; form.appendChild(i); }
          });
        });
      `
    }} />
  );
}